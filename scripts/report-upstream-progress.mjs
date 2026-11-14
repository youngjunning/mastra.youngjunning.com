import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const upstream = path.resolve(process.env.MASTRA_UPSTREAM_DIR ?? path.join(root, '..', 'github', 'mastra'))
const englishPathspec = ['docs/src/content/en', ':(glob)docs/src/learn/content/*.mdx']
const record = fs.readFileSync(path.join(root, 'UPSTREAM.md'), 'utf8')
const englishImportCommit = record.match(/Commit: `([0-9a-f]{40})`/)?.[1]
if (!englishImportCommit) throw new Error('UPSTREAM.md is missing its imported commit')
const sinceArgument = process.argv.find(argument => argument.startsWith('--since='))
if (process.argv.slice(2).some(argument => argument !== '--json' && !argument.startsWith('--since='))) {
  throw new Error('Usage: node scripts/report-upstream-progress.mjs [--json] [--since=COMMIT]')
}
const asJson = process.argv.includes('--json')
const sinceCommit = sinceArgument?.slice('--since='.length)

const git = (directory, ...args) => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8' }).trim()
const isAncestor = (older, newer) =>
  spawnSync('git', ['-C', upstream, 'merge-base', '--is-ancestor', older, newer]).status === 0

if (git(upstream, 'remote', 'get-url', 'origin') !== 'https://github.com/mastra-ai/mastra.git') {
  throw new Error(`Expected the official Mastra clone at ${upstream}`)
}

const head = git(upstream, 'rev-parse', 'HEAD')
const remoteHead = git(upstream, 'rev-parse', 'refs/remotes/origin/main')
if (head !== remoteHead) throw new Error('Update the official clone to origin/main before reporting')
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'UPSTREAM_INCREMENTAL.json'), 'utf8'))
const baseline = ledger.translationBaseCommit
if (!/^[0-9a-f]{40}$/.test(baseline ?? '') || !isAncestor(baseline, head)) {
  throw new Error('The translation comparison base is missing or no longer on upstream main')
}
if (!isAncestor(englishImportCommit, head)) {
  throw new Error('The last English import commit is not on upstream main')
}
if (sinceCommit && (!/^[0-9a-f]{40}$/.test(sinceCommit) || !isAncestor(sinceCommit, head))) {
  throw new Error('The requested comparison commit is not on upstream main')
}
const newCommitCount = sinceCommit ? Number(git(upstream, 'rev-list', '--count', `${sinceCommit}..${head}`)) : 0
const newDocumentationCommits = sinceCommit
  ? git(upstream, 'log', '--reverse', '--format=%H%x09%s', `${sinceCommit}..${head}`, '--', ...englishPathspec)
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [commit, ...subject] = line.split('\t')
        return { commit, subject: subject.join('\t') }
      })
  : []
const newChanges = sinceCommit
  ? git(upstream, 'diff', '--name-status', '--no-renames', sinceCommit, head, '--', ...englishPathspec)
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [status, sourcePath] = line.split('\t')
        return { status, path: sourcePath.replace(/^docs\//, '') }
      })
  : []
const newlyChangedPaths = new Set(newChanges.map(change => change.path))
const changes = git(upstream, 'diff', '--name-status', '--no-renames', baseline, head, '--', ...englishPathspec)
  .split('\n')
  .filter(Boolean)
  .map(line => {
    const [status, sourcePath] = line.split('\t')
    return { status, sourcePath, localPath: sourcePath.replace(/^docs\//, '') }
  })
const upstreamBlobs = new Map(
  git(upstream, 'ls-tree', '-r', 'HEAD', 'docs/src/content/en', 'docs/src/learn/content')
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [object, sourcePath] = line.split('\t')
      return [sourcePath, object.split(' ')[2]]
    })
    .filter(
      ([sourcePath]) =>
        sourcePath.startsWith('docs/src/content/en/') || /^docs\/src\/learn\/content\/[^/]+\.mdx$/.test(sourcePath),
    ),
)
const hashMatched = []
const pending = []
const removed = []
for (const change of changes) {
  if (change.status === 'D') {
    removed.push(change.localPath)
    continue
  }
  const entry = ledger.pages[change.localPath]
  const sourceBlob = upstreamBlobs.get(change.sourcePath)
  const englishPath = path.join(root, change.localPath)
  const chinesePath = entry && path.join(root, entry.zhCNPath)
  const matches =
    entry &&
    sourceBlob === entry.sourceBlob &&
    fs.existsSync(englishPath) &&
    git(root, 'hash-object', englishPath) === (entry.englishBlob ?? sourceBlob) &&
    fs.existsSync(chinesePath) &&
    git(root, 'hash-object', chinesePath) === entry.zhCNBlob
  if (matches) hashMatched.push(change.localPath)
  else pending.push(change.localPath)
}

pending.sort((a, b) => Number(newlyChangedPaths.has(b)) - Number(newlyChangedPaths.has(a)) || a.localeCompare(b))
const summary = {
  officialHead: head,
  englishImportCommit,
  translationBaseCommit: baseline,
  changedFileCount: changes.length,
  hashMatchedPairCount: hashMatched.length,
  pendingFileCount: pending.length,
  pendingRemovalCount: removed.length,
}
if (sinceCommit) {
  Object.assign(summary, {
    sinceCommit,
    newCommitCount,
    newDocumentationCommitCount: newDocumentationCommits.length,
    newChangedFileCount: newChanges.length,
  })
}
if (asJson) {
  console.log(JSON.stringify({ summary, newDocumentationCommits, newChanges, hashMatched, pending, removed }, null, 2))
} else {
  console.log(`Official main: ${head}`)
  console.log(`English full import: ${englishImportCommit}`)
  console.log(`Translation comparison base: ${baseline}`)
  if (sinceCommit) {
    console.log(`Changes since ${sinceCommit}: ${newCommitCount} commits; ${newChanges.length} English content files`)
    for (const item of newDocumentationCommits.slice(0, 10))
      console.log(`  ${item.commit.slice(0, 12)} ${item.subject}`)
    if (newDocumentationCommits.length > 10) {
      console.log(`  ... and ${newDocumentationCommits.length - 10} more documentation commits`)
    }
    for (const change of newChanges.slice(0, 20)) console.log(`  ${change.status} ${change.path}`)
    if (newChanges.length > 20) console.log(`  ... and ${newChanges.length - 20} more new changes`)
  }
  console.log(`All changed English content files since baseline: ${changes.length}`)
  console.log(`English + zh-CN pairs matching recorded hashes: ${hashMatched.length}`)
  console.log(`Pending files: ${pending.length}; pending removals: ${removed.length}`)
  for (const file of pending.slice(0, 20)) console.log(`  ${file}`)
  if (pending.length > 20) console.log(`  ... and ${pending.length - 20} more`)
}
