import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

import { unified } from 'unified'
import { visit } from 'unist-util-visit'

const projectRoot = path.resolve(import.meta.dirname, '..')
const checkOnly = process.argv.includes('--check')
const localeFlag = process.argv.find(argument => argument.startsWith('--locale='))
const unknownArguments = process.argv
  .slice(2)
  .filter(argument => argument !== '--check' && !argument.startsWith('--locale='))

const localeTargets = {
  'zh-CN': {
    docs: 'i18n/zh-CN/docusaurus-plugin-content-docs/current',
    integrations: 'i18n/zh-CN/docusaurus-plugin-content-docs-integrations/current',
    reference: 'i18n/zh-CN/docusaurus-plugin-content-docs-reference/current',
    models: 'i18n/zh-CN/docusaurus-plugin-content-docs-models/current',
    learn: 'src/learn/content/zh-CN',
  },
  fr: {
    docs: 'i18n/fr/docusaurus-plugin-content-docs/current',
    integrations: 'i18n/fr/docusaurus-plugin-content-docs-integrations/current',
    reference: 'i18n/fr/docusaurus-plugin-content-docs-reference/current',
    models: 'i18n/fr/docusaurus-plugin-content-docs-models/current',
    learn: 'src/learn/content/fr',
  },
  ko: {
    docs: 'i18n/ko/docusaurus-plugin-content-docs/current',
    integrations: 'i18n/ko/docusaurus-plugin-content-docs-integrations/current',
    reference: 'i18n/ko/docusaurus-plugin-content-docs-reference/current',
    models: 'i18n/ko/docusaurus-plugin-content-docs-models/current',
    learn: 'src/learn/content/ko',
  },
  'zh-TW': {
    docs: 'i18n/zh-TW/docusaurus-plugin-content-docs/current',
    integrations: 'i18n/zh-TW/docusaurus-plugin-content-docs-integrations/current',
    reference: 'i18n/zh-TW/docusaurus-plugin-content-docs-reference/current',
    models: 'i18n/zh-TW/docusaurus-plugin-content-docs-models/current',
    learn: 'src/learn/content/zh-TW',
  },
  'zh-HK': {
    docs: 'i18n/zh-HK/docusaurus-plugin-content-docs/current',
    integrations: 'i18n/zh-HK/docusaurus-plugin-content-docs-integrations/current',
    reference: 'i18n/zh-HK/docusaurus-plugin-content-docs-reference/current',
    models: 'i18n/zh-HK/docusaurus-plugin-content-docs-models/current',
    learn: 'src/learn/content/zh-HK',
  },
  ja: {
    docs: 'i18n/ja/docusaurus-plugin-content-docs/current',
    integrations: 'i18n/ja/docusaurus-plugin-content-docs-integrations/current',
    reference: 'i18n/ja/docusaurus-plugin-content-docs-reference/current',
    models: 'i18n/ja/docusaurus-plugin-content-docs-models/current',
    learn: 'src/learn/content/ja',
  },
}

const contentRoots = [
  { name: 'docs', source: 'src/content/en/docs', recursive: true },
  { name: 'integrations', source: 'src/content/en/integrations', recursive: true },
  { name: 'reference', source: 'src/content/en/reference', recursive: true },
  { name: 'models', source: 'src/content/en/models', recursive: true },
  { name: 'learn', source: 'src/learn/content', recursive: false },
]

if (unknownArguments.length > 0) {
  console.error(`Unknown argument(s): ${unknownArguments.join(', ')}`)
  console.error('Usage: node scripts/sync-localized-heading-anchors.mjs [--check] [--locale=LOCALE]')
  process.exit(2)
}

const requestedLocale = localeFlag?.slice('--locale='.length)
if (requestedLocale && !localeTargets[requestedLocale]) {
  console.error(`Unsupported locale: ${requestedLocale}`)
  process.exit(2)
}
const locales = requestedLocale ? [requestedLocale] : Object.keys(localeTargets)

const require = createRequire(import.meta.url)
let coreRequire
try {
  coreRequire = createRequire(require.resolve('@docusaurus/core/package.json'))
} catch {
  console.error('Docusaurus dependencies are unavailable. Run `pnpm install` before this script.')
  process.exit(2)
}

const remarkParse = (await import(pathToFileURL(coreRequire.resolve('remark-parse')))).default
const remarkMdx = (await import(pathToFileURL(coreRequire.resolve('remark-mdx')))).default
const remarkFrontmatter = (await import(pathToFileURL(coreRequire.resolve('remark-frontmatter')))).default
const loaderRoot = path.dirname(coreRequire.resolve('@docusaurus/mdx-loader/package.json'))
const headingsModule = await import(pathToFileURL(path.join(loaderRoot, 'lib/remark/headings/index.js')))
const docusaurusHeadings = headingsModule.default?.default ?? headingsModule.default
const { escapeMarkdownHeadingIds } = coreRequire('@docusaurus/utils')

async function listContentFiles(directory, recursive) {
  const files = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      if (recursive) files.push(...(await listContentFiles(entryPath, true)))
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push(entryPath)
    }
  }
  return files.sort()
}

async function parseHeadings(content, file) {
  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ['yaml', 'toml'])
      .use(remarkMdx)
      .use(docusaurusHeadings, { anchorsMaintainCase: false })
    const tree = processor.parse(escapeMarkdownHeadingIds(content))
    await processor.run(tree)
    const headings = []
    visit(tree, 'heading', node => {
      const startLine = node.position?.start.line
      const endLine = node.position?.end.line
      const id = node.data?.id
      if (!startLine || !endLine || typeof id !== 'string') {
        throw new Error(`${file}: heading is missing source position or generated ID`)
      }
      if (startLine !== endLine) throw new Error(`${file}:${startLine}: multiline heading is unsupported`)
      headings.push({ depth: node.depth, id, line: startLine })
    })
    return headings
  } catch (error) {
    throw new Error(`${file}: ${error instanceof Error ? error.message : String(error)}`, { cause: error })
  }
}

function explicitHeadingId(line) {
  const classic = /\s*\{#(?<id>(?:.(?!\{#|\}))*.)\}(?=\s*(?:#+\s*)?$)/.exec(line)
  if (classic?.groups?.id) return { id: classic.groups.id.trim(), match: classic[0], syntax: 'classic' }
  const mdxComment = /\s*\{\/\*\s*#(?<id>\S+)\s*\*\/\}(?=\s*(?:#+\s*)?$)/.exec(line)
  if (mdxComment?.groups?.id) return { id: mdxComment.groups.id.trim(), match: mdxComment[0], syntax: 'mdx-comment' }
  const htmlComment = /\s*<!--\s*#(?<id>\S+).*-->(?=\s*(?:#+\s*)?$)/.exec(line)
  if (htmlComment?.groups?.id) {
    return { id: htmlComment.groups.id.trim(), match: htmlComment[0], syntax: 'html-comment' }
  }
  return undefined
}

function addHeadingId(line, id) {
  const suffix = `{/* #${id} */}`
  const closingHashes = /^(?<text>.*?)(?<closing>[ \t]+#+[ \t]*)$/.exec(line)
  if (closingHashes?.groups) {
    return `${closingHashes.groups.text.trimEnd()} ${suffix}${closingHashes.groups.closing}`
  }
  return `${line.trimEnd()} ${suffix}`
}

const sourceData = new Map()
const errors = []
const warnings = []

for (const contentRoot of contentRoots) {
  const sourceRoot = path.join(projectRoot, contentRoot.source)
  const pages = new Map()
  for (const sourceFile of await listContentFiles(sourceRoot, contentRoot.recursive)) {
    const relativeFile = path.relative(sourceRoot, sourceFile)
    try {
      const content = await fs.readFile(sourceFile, 'utf8')
      pages.set(relativeFile, await parseHeadings(content, path.relative(projectRoot, sourceFile)))
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }
  sourceData.set(contentRoot.name, pages)
}

const plans = []

for (const locale of locales) {
  const summary = { pages: 0, headings: 0, changed: 0, added: 0, normalized: 0, removedH1: 0, skipped: 0 }
  for (const contentRoot of contentRoots) {
    const targetRoot = path.join(projectRoot, localeTargets[locale][contentRoot.name])
    const targetFiles = await listContentFiles(targetRoot, contentRoot.recursive)
    const targetSet = new Set(targetFiles.map(file => path.relative(targetRoot, file)))
    const sourcePages = sourceData.get(contentRoot.name)

    for (const relativeFile of sourcePages.keys()) {
      if (!targetSet.has(relativeFile)) errors.push(`${locale}/${contentRoot.name}: missing ${relativeFile}`)
    }
    for (const relativeFile of targetSet) {
      if (!sourcePages.has(relativeFile)) errors.push(`${locale}/${contentRoot.name}: extra ${relativeFile}`)
    }

    for (const [relativeFile, sourceHeadings] of sourcePages) {
      if (!targetSet.has(relativeFile)) continue
      const targetFile = path.join(targetRoot, relativeFile)
      const targetContent = await fs.readFile(targetFile, 'utf8')
      let targetHeadings
      try {
        targetHeadings = await parseHeadings(targetContent, path.relative(projectRoot, targetFile))
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error))
        continue
      }

      summary.pages += 1
      summary.headings += sourceHeadings.filter(heading => heading.depth > 1).length
      if (sourceHeadings.length !== targetHeadings.length) {
        errors.push(
          `${locale}/${contentRoot.name}/${relativeFile}: heading count ${sourceHeadings.length} != ${targetHeadings.length}`,
        )
        continue
      }

      const eol = targetContent.includes('\r\n') ? '\r\n' : '\n'
      const targetLines = targetContent.split(/\r?\n/)
      let added = 0
      let normalized = 0
      let removedH1 = 0
      let pageFailed = false

      for (let index = 0; index < sourceHeadings.length; index += 1) {
        const sourceHeading = sourceHeadings[index]
        const targetHeading = targetHeadings[index]
        if (sourceHeading.depth !== targetHeading.depth) {
          errors.push(
            `${locale}/${contentRoot.name}/${relativeFile}: heading ${index + 1} depth ${sourceHeading.depth} != ${targetHeading.depth}`,
          )
          pageFailed = true
          continue
        }
        const lineIndex = targetHeading.line - 1
        const targetLine = targetLines[lineIndex]
        const existingAnchor = explicitHeadingId(targetLine)

        // Docusaurus does not create autolink anchors for H1 headings. Keep
        // their localized IDs so generated page metadata is not polluted.
        if (sourceHeading.depth === 1) {
          if (existingAnchor?.syntax === 'mdx-comment' && existingAnchor.id === sourceHeading.id) {
            targetLines[lineIndex] = targetLine.replace(existingAnchor.match, '').trimEnd()
            removedH1 += 1
          }
          continue
        }

        if (!sourceHeading.id) {
          warnings.push(`${contentRoot.name}/${relativeFile}:${sourceHeading.line}: empty English heading ID`)
          summary.skipped += 1
          continue
        }
        if (existingAnchor) {
          if (existingAnchor.id !== sourceHeading.id) {
            errors.push(
              `${locale}/${contentRoot.name}/${relativeFile}:${targetHeading.line}: ID ${existingAnchor.id} != ${sourceHeading.id}`,
            )
            pageFailed = true
          } else if (existingAnchor.syntax !== 'mdx-comment') {
            targetLines[lineIndex] = addHeadingId(targetLine.replace(existingAnchor.match, ''), sourceHeading.id)
            normalized += 1
          }
          continue
        }
        targetLines[lineIndex] = addHeadingId(targetLine, sourceHeading.id)
        added += 1
      }

      if (pageFailed || added + normalized + removedH1 === 0) continue
      const nextContent = targetLines.join(eol)
      let verifiedHeadings
      try {
        verifiedHeadings = await parseHeadings(nextContent, path.relative(projectRoot, targetFile))
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error))
        continue
      }
      for (let index = 0; index < sourceHeadings.length; index += 1) {
        const expectedId = sourceHeadings[index].id
        if (sourceHeadings[index].depth === 1) continue
        if (expectedId && verifiedHeadings[index]?.id !== expectedId) {
          errors.push(
            `${locale}/${contentRoot.name}/${relativeFile}: verified ID ${verifiedHeadings[index]?.id ?? '<missing>'} != ${expectedId}`,
          )
          pageFailed = true
        }
      }
      if (pageFailed) continue

      plans.push({ content: nextContent, file: targetFile, locale })
      summary.changed += 1
      summary.added += added
      summary.normalized += normalized
      summary.removedH1 += removedH1
    }
  }
  console.log(
    `${locale}: ${summary.pages} pages, ${summary.headings} headings, ${summary.changed} pages need changes, ${summary.added} anchors to add, ${summary.normalized} to normalize, ${summary.removedH1} H1 anchors to remove, ${summary.skipped} skipped`,
  )
}

if (warnings.length > 0) {
  const uniqueWarnings = [...new Set(warnings)]
  console.warn(`\n${uniqueWarnings.length} source heading warning(s):`)
  for (const warning of uniqueWarnings) console.warn(`- ${warning}`)
}

if (errors.length > 0) {
  console.error(`\nRefusing to write because ${errors.length} structural error(s) were found:`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

if (checkOnly) {
  if (plans.length > 0) {
    console.error(`\n${plans.length} localized file(s) do not preserve their English heading anchors.`)
    process.exit(1)
  }
  console.log('\nAll localized headings preserve their English anchors.')
} else if (plans.length === 0) {
  console.log('\nNo changes needed; all localized headings preserve their English anchors.')
} else {
  await Promise.all(plans.map(plan => fs.writeFile(plan.file, plan.content)))
  for (const locale of locales) {
    console.log(`Updated ${plans.filter(plan => plan.locale === locale).length} ${locale} file(s).`)
  }
}
