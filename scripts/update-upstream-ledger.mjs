import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const upstream = path.resolve(process.env.MASTRA_UPSTREAM_DIR ?? path.join(root, '..', 'github', 'mastra'))
const ledgerPath = path.join(root, 'UPSTREAM_INCREMENTAL.json')
const previousLedger = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, 'utf8')) : {}
const git = (directory, ...args) => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8' }).trim()
const head = git(upstream, 'rev-parse', 'HEAD')
const remoteHead = git(upstream, 'rev-parse', 'refs/remotes/origin/main')
if (head !== remoteHead) throw new Error('Update the official clone to origin/main before updating the ledger')
if (git(upstream, 'remote', 'get-url', 'origin') !== 'https://github.com/mastra-ai/mastra.git') {
  throw new Error('The configured upstream clone is not the official Mastra repository')
}

const localeFields = {
  'zh-CN': ['zhCNPath', 'zhCNBlob'],
  'zh-TW': ['zhTWPath', 'zhTWBlob'],
  'zh-HK': ['zhHKPath', 'zhHKBlob'],
}
const pluginIds = {
  docs: 'docusaurus-plugin-content-docs',
  integrations: 'docusaurus-plugin-content-docs-integrations',
  models: 'docusaurus-plugin-content-docs-models',
  reference: 'docusaurus-plugin-content-docs-reference',
}

function localizedPath(englishPath, locale) {
  if (englishPath.startsWith('src/learn/content/')) {
    return englishPath.replace('src/learn/content/', `src/learn/content/${locale}/`)
  }
  const match = /^src\/content\/en\/([^/]+)\/(.+)$/.exec(englishPath)
  if (!match || !pluginIds[match[1]]) throw new Error(`Unsupported English content path: ${englishPath}`)
  return `i18n/${locale}/${pluginIds[match[1]]}/current/${match[2]}`
}

const changes = git(upstream, 'ls-tree', '-r', '--name-only', 'HEAD', 'docs/src/content/en', 'docs/src/learn/content')
  .split('\n')
  .filter(Boolean)
  .filter(
    sourcePath =>
      /^docs\/src\/content\/en\/(docs|integrations|models|reference)\/.+\.mdx$/.test(sourcePath) ||
      /^docs\/src\/learn\/content\/[^/]+\.mdx$/.test(sourcePath),
  )
  .map(sourcePath => ({ sourcePath, englishPath: sourcePath.replace(/^docs\//, '') }))

const pages = {}
for (const change of changes) {
  const englishFile = path.join(root, change.englishPath)
  if (!fs.existsSync(englishFile)) throw new Error(`Missing imported English file: ${change.englishPath}`)
  const sourceBlob = git(upstream, 'rev-parse', `HEAD:${change.sourcePath}`)
  const englishBlob = git(root, 'hash-object', englishFile)
  const entry = { sourceBlob }
  if (englishBlob !== sourceBlob) entry.englishBlob = englishBlob
  for (const [locale, [pathField, blobField]] of Object.entries(localeFields)) {
    const localePath = localizedPath(change.englishPath, locale)
    const localeFile = path.join(root, localePath)
    if (!fs.existsSync(localeFile)) throw new Error(`Missing ${locale} file: ${localePath}`)
    entry[pathField] = localePath
    entry[blobField] = git(root, 'hash-object', localeFile)
  }
  pages[change.englishPath] = entry
}

const reviewedPages = {}
for (const [englishPath, review] of Object.entries(previousLedger.aiPolish?.reviewedPages ?? {})) {
  const current = pages[englishPath]
  if (!current || review.sourceBlob !== current.sourceBlob) continue
  const locales = {}
  for (const [locale, [, blobField]] of Object.entries(localeFields)) {
    const localeReview = review.locales?.[locale]
    if (localeReview?.blob === current[blobField]) locales[locale] = localeReview
  }
  if (Object.keys(locales).length > 0) reviewedPages[englishPath] = { sourceBlob: current.sourceBlob, locales }
}

fs.writeFileSync(
  ledgerPath,
  JSON.stringify(
    {
      translationBaseCommit: head,
      aiPolish: { version: 1, required: true, reviewedPages },
      pages,
    },
    null,
    2,
  ) + '\n',
)
console.log(`Recorded ${Object.keys(pages).length} multilingual page pairs at ${head}`)
