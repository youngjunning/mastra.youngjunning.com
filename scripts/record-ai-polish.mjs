import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const ledgerPath = path.join(root, 'UPSTREAM_INCREMENTAL.json')
const supportedLocales = {
  'zh-CN': ['zhCNPath', 'zhCNBlob'],
  'zh-TW': ['zhTWPath', 'zhTWBlob'],
  'zh-HK': ['zhHKPath', 'zhHKBlob'],
}

const args = process.argv.slice(2)
const option = name => args.find(argument => argument.startsWith(`--${name}=`))?.slice(name.length + 3)
const model = option('model')
const promptVersion = option('prompt-version')
const localeOption = option('locales')
const reviewedAt = option('reviewed-at') ?? new Date().toISOString()
const dryRun = args.includes('--dry-run')
const englishPaths = args.filter(argument => !argument.startsWith('--'))

if (!model || !promptVersion || !localeOption || englishPaths.length === 0) {
  throw new Error(
    'Usage: node scripts/record-ai-polish.mjs --model=MODEL --prompt-version=VERSION ' +
      '--locales=zh-CN,zh-TW,zh-HK [--reviewed-at=ISO_DATE] [--dry-run] ENGLISH_PATH...',
  )
}

const locales = [...new Set(localeOption.split(',').filter(Boolean))]
for (const locale of locales) {
  if (!supportedLocales[locale]) throw new Error(`Unsupported locale: ${locale}`)
}

const git = (...gitArgs) => execFileSync('git', ['-C', root, ...gitArgs], { encoding: 'utf8' }).trim()
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))
ledger.aiPolish ??= { version: 1, required: true, reviewedPages: {} }
ledger.aiPolish.version = 1
ledger.aiPolish.required = true
ledger.aiPolish.reviewedPages ??= {}

for (const englishPath of englishPaths) {
  const entry = ledger.pages?.[englishPath]
  if (!entry) throw new Error(`Page is not in the upstream ledger: ${englishPath}`)

  const existingReview = ledger.aiPolish.reviewedPages[englishPath]
  const review = {
    sourceBlob: entry.sourceBlob,
    locales: existingReview?.sourceBlob === entry.sourceBlob ? { ...existingReview.locales } : {},
  }

  for (const locale of locales) {
    const [pathField, blobField] = supportedLocales[locale]
    const localePath = entry[pathField]
    const localeFile = path.join(root, localePath)
    if (!fs.existsSync(localeFile)) throw new Error(`Missing ${locale} file: ${localePath}`)
    const blob = git('hash-object', localeFile)
    entry[blobField] = blob
    review.locales[locale] = { blob, model, promptVersion, reviewedAt }
  }

  ledger.aiPolish.reviewedPages[englishPath] = review
}

if (!dryRun) fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + '\n')
console.log(
  `${dryRun ? 'Would record' : 'Recorded'} AI polish for ${englishPaths.length} page(s) across ${locales.length} locale(s)`,
)
