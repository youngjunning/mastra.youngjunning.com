import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const repositoryRoot = path.resolve(import.meta.dirname, '..')
const upstreamRoot = path.resolve(
  process.env.MASTRA_UPSTREAM_DIR ?? path.join(repositoryRoot, '..', 'github', 'mastra'),
)
const upstreamDocs = path.join(upstreamRoot, 'docs')
const expectedBranch = 'main'
const expectedOrigin = 'https://github.com/mastra-ai/mastra.git'

const protectedPaths = [
  '.env.example',
  'README.md',
  'docusaurus.config.ts',
  'package.json',
  'static/robots.txt',
  'static/img/og-home.png',
  'src/components/cookie/cookie-consent.tsx',
  'src/pages/index.module.css',
  'src/pages/index.tsx',
  'src/theme/Navbar/index.tsx',
  'src/theme/Root.tsx',
]

const output = (command, args, cwd = repositoryRoot) => execFileSync(command, args, { cwd, encoding: 'utf8' }).trim()

const run = (command, args, cwd = repositoryRoot) => {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

if (!fs.existsSync(path.join(repositoryRoot, '.git'))) {
  throw new Error(`Target is not a Git repository: ${repositoryRoot}`)
}
if (!fs.existsSync(upstreamDocs)) {
  throw new Error(`Mastra docs directory was not found: ${upstreamDocs}`)
}
if (output('git', ['branch', '--show-current']) !== expectedBranch) {
  throw new Error(`Run this command from the ${expectedBranch} branch`)
}
if (output('git', ['status', '--porcelain'])) {
  throw new Error('Commit or stash local changes before syncing upstream')
}
if (output('git', ['-C', upstreamRoot, 'status', '--porcelain'])) {
  throw new Error(`The upstream clone has local changes: ${upstreamRoot}`)
}
if (output('git', ['-C', upstreamRoot, 'remote', 'get-url', 'origin']) !== expectedOrigin) {
  throw new Error(`Unexpected upstream origin; expected ${expectedOrigin}`)
}

const upstreamRecordPath = path.join(repositoryRoot, 'UPSTREAM.md')
const upstreamRecord = fs.readFileSync(upstreamRecordPath, 'utf8')
const previousCommit = upstreamRecord.match(/Commit: `([0-9a-f]{40})`/)?.[1]
if (!previousCommit) throw new Error('Could not read the previous commit from UPSTREAM.md')

run('git', ['-C', upstreamRoot, 'fetch', 'origin', 'main'])
run('git', ['-C', upstreamRoot, 'switch', 'main'])
run('git', ['-C', upstreamRoot, 'pull', '--ff-only', 'origin', 'main'])

const latestCommit = output('git', ['-C', upstreamRoot, 'rev-parse', 'HEAD'])
if (latestCommit === previousCommit) {
  console.log(`Already synced to the latest upstream commit: ${latestCommit}`)
  process.exit(0)
}

const changedProtectedPaths = output('git', [
  '-C',
  upstreamRoot,
  'diff',
  '--name-only',
  previousCommit,
  latestCommit,
  '--',
  ...protectedPaths.map(file => `docs/${file}`),
])
if (changedProtectedPaths) {
  console.error('Upstream changed locally adapted files. Review and rebase these files before syncing:')
  console.error(changedProtectedPaths)
  process.exit(2)
}

const exclusions = [
  '/.git/',
  '/.docusaurus/',
  '/.codex/',
  '/build/',
  '/node_modules/',
  '/pnpm-lock.yaml',
  '/pnpm-workspace.yaml',
  '/UPSTREAM.md',
  '/UPSTREAM_INCREMENTAL.json',
  '/LICENSE.md',
  '/AGENTS.md',
  '/i18n/',
  '/src/learn/content/fr/',
  '/src/learn/content/ja/',
  '/src/learn/content/ko/',
  '/src/learn/content/zh-CN/',
  '/src/learn/content/zh-HK/',
  '/src/learn/content/zh-TW/',
  '/static/googled29fba422c357ff8.html',
  '/scripts/sync-upstream.mjs',
  '/scripts/report-upstream-progress.mjs',
  '/scripts/generate-ko-localization.mjs',
  '/scripts/generate-zh-model-docs.mjs',
  '/scripts/generate-zh-tw-model-docs.mjs',
  '/scripts/generate-zh-hk-model-docs.mjs',
  '/scripts/sync-localized-heading-anchors.mjs',
  '/scripts/update-upstream-ledger.mjs',
  '/src/sidebar-keys.js',
  '/styleguides/AUTHORING_WORKFLOW.md',
  '/styleguides/CHECKS.md',
  '/styleguides/COMPONENTS.md',
  '/styleguides/DOC.md',
  '/styleguides/GUIDE_INTEGRATION.md',
  '/styleguides/INFORMATION_ARCHITECTURE.md',
  '/styleguides/REFERENCE.md',
  '/styleguides/STYLEGUIDE.md',
  ...protectedPaths.map(file => `/${file}`),
]

run('rsync', [
  '-a',
  '--delete',
  ...exclusions.flatMap(file => ['--exclude', file]),
  `${upstreamDocs}/`,
  `${repositoryRoot}/`,
])

// The Vercel project previously built a Dumi site into `dist`. Keep the
// standalone Docusaurus output settings after every upstream docs sync.
const vercelConfigPath = path.join(repositoryRoot, 'vercel.json')
const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'))
fs.writeFileSync(
  vercelConfigPath,
  `${JSON.stringify(
    {
      ...vercelConfig,
      buildCommand: 'pnpm build',
      installCommand: 'pnpm install --frozen-lockfile',
      outputDirectory: 'build',
    },
    null,
    2,
  )}\n`,
)

fs.copyFileSync(path.join(upstreamRoot, 'LICENSE.md'), path.join(repositoryRoot, 'LICENSE.md'))
const syncedDate = new Date().toISOString().slice(0, 10)
fs.writeFileSync(
  upstreamRecordPath,
  `# Upstream source

- Repository: https://github.com/mastra-ai/mastra
- Branch: \`main\`
- Commit: \`${latestCommit}\`
- Synced: ${syncedDate}
- Imported path: \`docs/\`

The imported content contains only the current documentation snapshot. It does
not vendor Mastra's Git history, release branches, tags, or a versioned docs
site. The landing page, domain, analytics, and deployment configuration are
maintained locally.
`,
)

console.log(`Synced Mastra docs: ${previousCommit} -> ${latestCommit}`)
console.log('Next: pnpm install, pnpm validate, pnpm test, and pnpm build')
