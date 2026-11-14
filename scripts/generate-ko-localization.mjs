import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { unified } from 'unified'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { visit } from 'unist-util-visit'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const translationEndpoint = 'https://clients5.google.com/translate_a/t'
const argumentsByName = new Map(process.argv.slice(2).map(argument => {
  const [name, value = ''] = argument.replace(/^--/, '').split('=', 2)
  return [name, value]
}))
const locale = argumentsByName.get('locale') || 'ko'
if (!['ko', 'zh-CN', 'zh-TW', 'zh-HK'].includes(locale)) throw new Error(`Unsupported locale: ${locale}`)
const targetLanguage = locale === 'ko' ? 'ko' : locale === 'zh-CN' ? 'zh-CN' : 'zh-TW'
const sourceTargets = [
  { name: 'docs', source: 'src/content/en/docs', target: `i18n/${locale}/docusaurus-plugin-content-docs/current` },
  { name: 'integrations', source: 'src/content/en/integrations', target: `i18n/${locale}/docusaurus-plugin-content-docs-integrations/current` },
  { name: 'reference', source: 'src/content/en/reference', target: `i18n/${locale}/docusaurus-plugin-content-docs-reference/current` },
  { name: 'models', source: 'src/content/en/models', target: `i18n/${locale}/docusaurus-plugin-content-docs-models/current` },
  { name: 'learn', source: 'src/learn/content', target: `src/learn/content/${locale}` },
]

const cache = new Map()
const maxRequestLength = 4200
const isChineseLocale = locale.startsWith('zh-')
const concurrency = isChineseLocale ? 8 : 16
const mdxProcessor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkFrontmatter, ['yaml'])
  .use(remarkStringify)
  .use(remarkMdx)
const selectedGroup = argumentsByName.get('group')
const offset = Number(argumentsByName.get('offset') ?? 0)
const limit = Number(argumentsByName.get('limit') ?? Number.POSITIVE_INFINITY)
const manifestPath = argumentsByName.get('manifest')
const manifest = manifestPath
  ? new Set((await fs.readFile(path.resolve(manifestPath), 'utf8')).split('\n').map(line => line.trim()).filter(Boolean))
  : null
const statePath = argumentsByName.get('state')
const completedFiles = statePath
  ? new Set(
      (await fs.readFile(path.resolve(statePath), 'utf8').catch(() => ''))
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean),
    )
  : new Set()

async function listFiles(directory, extension = '.mdx') {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory() && !['fr', 'ja', 'ko', 'zh-CN', 'zh-HK', 'zh-TW'].includes(entry.name)) {
      files.push(...(await listFiles(fullPath, extension)))
    }
    else if (entry.name.endsWith(extension)) files.push(fullPath)
  }

  return files.sort()
}

function protect(text) {
  const values = []
  const keep = value => {
    const key = `ZZZKEEP${values.length}ZZZ`
    values.push(value)
    return key
  }

  const protectedText = text
    .replace(/```[\s\S]*?```/g, keep)
    .replace(/<[A-Z][\s\S]*?\/>/g, keep)
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, keep)
    // Keep whole MDX, links, URLs, and expression lines intact. Translating only
    // their surrounding prose preserves a valid document for the MDX compiler.
    .replace(/^.*(?:[<>{}]|https?:\/\/|\[[^\]]*\]).*$/gm, keep)
    .replace(/^(?:import|export) .+$/gm, keep)
    // Docusaurus requires frontmatter keys and non-localized metadata unchanged.
    .replace(/^(?!title:|description:)[A-Za-z][A-Za-z0-9_-]*:.*$/gm, keep)
    .replace(/^\s{2,}-\s+.*$/gm, keep)
    .replace(/^(title|description):/gm, (_, key) => `${keep(key)}:`)
    .replace(/^:::[^\n]*$/gm, keep)
    .replace(/`[^`\n]+`/g, keep)
    .replace(/https?:\/\/[^\s)<]+/g, keep)
    .replace(/\]\(\/[^)]+\)/g, keep)
    .replace(/<\/?[A-Za-z][^>]*>/g, keep)
    .replace(/^\|(?:\s*:?-{3,}:?\s*\|)+\s*$/gm, keep)

  return { protectedText, values }
}

function restore(text, values) {
  let restored = text
  let previous
  do {
    previous = restored
    restored = restored.replace(/ZZZKEEP(\d+)ZZZ/g, (_, index) => values[Number(index)] ?? _)
  } while (restored !== previous)
  return restored
}

async function translateText(text) {
  const normalized = text.trim()
  if (!normalized || !/[A-Za-z]/.test(normalized)) return text
  if (cache.has(text)) return cache.get(text)

  const url = new URL(translationEndpoint)
  url.searchParams.set('client', 'dict-chrome-ex')
  url.searchParams.set('sl', 'en')
  url.searchParams.set('tl', targetLanguage)
  url.searchParams.set('q', text)

  let response
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      response = await fetch(url)
      if (response.ok) break
      if (attempt === 6) throw new Error(`Translation request failed (${response.status})`)
    } catch (error) {
      if (attempt === 6) throw error
    }
    const delay = response?.status === 429 ? attempt * 10000 : attempt * 1000
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  const payload = await response.json()
  const translated = typeof payload[0] === 'string'
    ? payload.join('')
    : payload[0].map(segment => segment[0]).join('')
  cache.set(text, translated)
  if (isChineseLocale) await new Promise(resolve => setTimeout(resolve, 50))
  return translated
}

async function translateMarkdown(content) {
  const { protectedText, values } = protect(content)
  const parts = []
  let remainder = protectedText

  while (remainder.length > maxRequestLength) {
    let boundary = remainder.lastIndexOf('\n', maxRequestLength)
    if (boundary < maxRequestLength / 2) boundary = maxRequestLength
    parts.push(remainder.slice(0, boundary))
    remainder = remainder.slice(boundary)
  }
  parts.push(remainder)

  const translated = await Promise.all(parts.map(translateText))
  return restore(translated.join(''), values)
}

async function translateTextNodes(values) {
  const results = new Map()
  const pending = [...new Set(values.filter(value => value.trim() && /[A-Za-z]/.test(value)))]
  const batches = []
  let batch = []
  let length = 0

  for (const value of pending) {
    if (batch.length > 0 && length + value.length + 40 > maxRequestLength) {
      batches.push(batch)
      batch = []
      length = 0
    }
    batch.push(value)
    length += value.length + 40
  }
  if (batch.length > 0) batches.push(batch)

  await mapWithConcurrency(batches, async valuesInBatch => {
    const separator = index => '\nZZZMASTRATRANSLATIONSEPARATOR' + index + 'ZZZ\n'
    const joined = valuesInBatch.map((value, index) => separator(index) + value).join('')
    const translated = await translateText(joined)

    for (const [index, value] of valuesInBatch.entries()) {
      const start = translated.indexOf(separator(index))
      const end = index + 1 < valuesInBatch.length ? translated.indexOf(separator(index + 1)) : translated.length
      results.set(value, start >= 0 && end >= start ? translated.slice(start + separator(index).length, end) : await translateText(value))
    }
  })

  return results
}

async function translateMdx(content) {
  const tree = mdxProcessor.parse(content)
  const nodes = []
  visit(tree, 'text', node => nodes.push(node))
  const translations = await translateTextNodes(nodes.map(node => node.value))
  for (const node of nodes) {
    if (translations.has(node.value)) node.value = translations.get(node.value)
  }
  return mdxProcessor
    .stringify(tree)
    .replace(/from (['"])(?:\.\.\/)+components\//g, "from $1@site/src/components/")
}

async function mapWithConcurrency(values, operation) {
  let nextIndex = 0
  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, async () => {
      while (nextIndex < values.length) {
        const index = nextIndex++
        await operation(values[index], index)
      }
    }),
  )
}

async function copyAndTranslate(sourceDirectory, targetDirectory) {
  const sourcePath = path.join(root, sourceDirectory)
  const targetPath = path.join(root, targetDirectory)
  const files = (await listFiles(sourcePath))
    .filter(file => !manifest || manifest.has(path.relative(root, file)))
    .filter(file => !completedFiles.has(path.relative(root, file)))
    .slice(offset, offset + limit)

  let completed = 0
  await mapWithConcurrency(files, async file => {
    const relativePath = path.relative(sourcePath, file)
    const destination = path.join(targetPath, relativePath)
    const content = await fs.readFile(file, 'utf8')
    const translated = await translateMdx(content)
    await fs.mkdir(path.dirname(destination), { recursive: true })
    await fs.writeFile(destination, translated)
    completedFiles.add(path.relative(root, file))
    if (statePath) await fs.writeFile(path.resolve(statePath), [...completedFiles].sort().join('\n') + '\n')
    completed += 1
    if (completed % 25 === 0) console.log(`${sourceDirectory}: ${completed}/${files.length}`)
  })
}

async function translateJsonFile(file) {
  const content = JSON.parse(await fs.readFile(file, 'utf8'))
  const strings = []

  function collect(value, parent, key) {
    if (typeof value === 'string') strings.push({ parent, key, value })
    else if (Array.isArray(value)) value.forEach((child, index) => collect(child, value, index))
    else if (value && typeof value === 'object') Object.entries(value).forEach(([childKey, child]) => collect(child, value, childKey))
  }

  collect(content)
  for (let index = 0; index < strings.length; index += concurrency) {
    const group = strings.slice(index, index + concurrency)
    const translations = await Promise.all(group.map(item => translateText(item.value)))
    group.forEach((item, translationIndex) => {
      item.parent[item.key] = translations[translationIndex]
    })
  }

  await fs.writeFile(file, `${JSON.stringify(content, null, 2)}\n`)
}

async function translateCourseFile() {
  const source = await fs.readFile(path.join(root, 'src/learn/course.ts'), 'utf8')
  const strings = []
  const replaced = source.replace(/(['"])(?:(?!\1|\\).|\\.)*\1|`[\s\S]*?`/g, match => {
    // Only translate string values. Imports, keys, slugs, IDs, and dates remain literal.
    const previous = source.slice(0, source.indexOf(match)).trimEnd()
    if (previous.endsWith('from') || /(?:slug|courseId|status|youtubeId|publishedDate):\s*$/.test(previous)) return match
    const quote = match[0]
    const value = match.slice(1, -1)
    if (!/[A-Za-z]/.test(value)) return match
    const key = `ZZZCOURSE${strings.length}ZZZ`
    strings.push({ key, quote, value })
    return key
  })

  const translations = await Promise.all(strings.map(item => translateText(item.value)))
  let localized = replaced
  for (const [index, item] of strings.entries()) {
    localized = localized.replace(item.key, `${item.quote}${translations[index]}${item.quote}`)
  }
  await fs.writeFile(path.join(root, `src/learn/course.${locale}.ts`), localized)

  const index = await fs.readFile(path.join(root, 'src/learn/contentIndex.ts'), 'utf8')
  await fs.writeFile(
    path.join(root, `src/learn/contentIndex.${locale}.ts`),
    index.replaceAll("./content/", `./content/${locale}/`),
  )
}

async function applyTerminology() {
  const sharedReplacements = [
    ['@site/src/content/en/docs/', `@site/i18n/${locale}/docusaurus-plugin-content-docs/current/`],
    ['@site/src/content/en/integrations/', `@site/i18n/${locale}/docusaurus-plugin-content-docs-integrations/current/`],
    ['@site/src/content/en/reference/', `@site/i18n/${locale}/docusaurus-plugin-content-docs-reference/current/`],
    ['../docs/', '../../docusaurus-plugin-content-docs/current/'],
  ]
  const localeReplacements = locale === 'zh-CN'
    ? [
        ['代理人', 'Agent'],
        ['代理', 'Agent'],
        ['工作流', 'Workflow'],
        ['提供商', 'Provider'],
        ['供应商', 'Provider'],
        ['工具', 'Tool'],
        ['沙箱', 'Sandbox'],
        ['工作区', 'Workspace'],
        ['可观测性', 'Observability'],
      ]
    : locale === 'zh-TW'
      ? [
          ['代理人', 'Agent'],
          ['代理', 'Agent'],
          ['工作流程', 'Workflow'],
          ['供應商', 'Provider'],
          ['提供者', 'Provider'],
          ['工具', 'Tool'],
          ['沙盒', 'Sandbox'],
          ['工作區', 'Workspace'],
          ['可觀測性', 'Observability'],
        ]
      : locale === 'zh-HK'
        ? [
            ['代理人', 'Agent'],
            ['代理', 'Agent'],
            ['工作流程', 'Workflow'],
            ['供應商', 'Provider'],
            ['工具', 'Tool'],
            ['沙盒', 'Sandbox'],
            ['工作區', 'Workspace'],
            ['可觀測性', 'Observability'],
          ]
    : [
        ['자치령 대표', 'Agent'],
        ['상담원', 'Agent'],
        ['에이전트', 'Agent'],
        ['워크플로', 'Workflow'],
        ['제공업체', 'Provider'],
        ['모델', 'Model'],
        ['도구', 'Tool'],
        ['메모리', 'Memory'],
        ['프롬프트', 'Prompt'],
        ['관찰 가능성', 'Observability'],
      ]
  const replacements = [...sharedReplacements, ...localeReplacements]
  const files = [
    ...(await listFiles(path.join(root, `i18n/${locale}`))),
    ...(await listFiles(path.join(root, `i18n/${locale}`), '.json')),
    ...(await listFiles(path.join(root, `src/learn/content/${locale}`))),
  ]
  const courseFile = path.join(root, `src/learn/course.${locale}.ts`)
  try {
    await fs.access(courseFile)
    files.push(courseFile)
  } catch {}

  for (const file of files) {
    let content = await fs.readFile(file, 'utf8')
    for (const [source, target] of replacements) content = content.replaceAll(source, target)
    await fs.writeFile(file, content)
  }
}

async function restoreStructuralLines() {
  const isStructural = line =>
    /[<>{}]|https?:\/\/|\[[^\]]*\]\([^)]+\)|^:::/u.test(line) || /^(?:import|export)\s/u.test(line)

  for (const { source, target } of sourceTargets) {
    const sourceDirectory = path.join(root, source)
    const targetDirectory = path.join(root, target)
    for (const sourceFile of await listFiles(sourceDirectory)) {
      const relativePath = path.relative(sourceDirectory, sourceFile)
      const targetFile = path.join(targetDirectory, relativePath)
      const [sourceContent, targetContent] = await Promise.all([fs.readFile(sourceFile, 'utf8'), fs.readFile(targetFile, 'utf8')])
      const sourceLines = sourceContent.split('\n')
      const targetLines = targetContent.split('\n')
      if (sourceLines.length !== targetLines.length) continue

      const restored = targetLines.map((line, index) => (isStructural(sourceLines[index]) ? sourceLines[index] : line)).join('\n')
      if (restored !== targetContent) await fs.writeFile(targetFile, restored)
    }
  }
}

async function translateFrontmatter() {
  const records = []
  for (const { source, target } of sourceTargets) {
    const sourceDirectory = path.join(root, source)
    const targetDirectory = path.join(root, target)
    for (const sourceFile of await listFiles(sourceDirectory)) {
      const relativePath = path.relative(sourceDirectory, sourceFile)
      const targetFile = path.join(targetDirectory, relativePath)
      const sourceContent = await fs.readFile(sourceFile, 'utf8')
      const targetContent = await fs.readFile(targetFile, 'utf8')
      const sourceMatch = sourceContent.match(/^---\n([\s\S]*?)\n---/)
      const targetMatch = targetContent.match(/^---\n([\s\S]*?)\n---/)
      if (!sourceMatch || !targetMatch) continue

      for (const key of ['title', 'description']) {
        const valueMatch = sourceMatch[1].match(new RegExp('^' + key + ':\\s*(.*)$', 'm'))
        const value = valueMatch?.[1]?.replace(/^['\"]|['\"]$/g, '')
        if (value && /[A-Za-z]/.test(value)) records.push({ key, source: value, targetFile, targetContent })
      }
    }
  }

  const translations = await translateTextNodes(records.map(record => record.source))
  const byFile = new Map()
  for (const record of records) {
    const content = byFile.get(record.targetFile) ?? record.targetContent
    const translation = translations.get(record.source) ?? record.source
    byFile.set(record.targetFile, content.replace(new RegExp('^' + record.key + ':.*$', 'm'), record.key + ': ' + JSON.stringify(translation)))
  }
  for (const [file, content] of byFile) await fs.writeFile(file, content)
}

const targets = selectedGroup ? sourceTargets.filter(target => target.name === selectedGroup) : sourceTargets
if (selectedGroup && targets.length === 0) throw new Error(`Unknown content group: ${selectedGroup}`)

if (argumentsByName.has('glossary')) {
  await applyTerminology()
  console.log(`Applied ${locale} technical terminology.`)
  process.exit(0)
}

if (argumentsByName.has('structure')) {
  await restoreStructuralLines()
  await applyTerminology()
  console.log('Restored MDX structure from the English source.')
  process.exit(0)
}

if (argumentsByName.has('frontmatter')) {
  await translateFrontmatter()
  await applyTerminology()
  console.log(`Translated ${locale} frontmatter.`)
  process.exit(0)
}

for (const { source, target } of targets) await copyAndTranslate(source, target)

if (!selectedGroup || argumentsByName.has('finalize')) {
  for (const file of await listFiles(path.join(root, `i18n/${locale}`), '.json')) await translateJsonFile(file)
  await translateCourseFile()
  await applyTerminology()
}

console.log(`Generated ${locale} localization from the English source.`)
