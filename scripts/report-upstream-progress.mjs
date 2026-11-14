import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const upstream = path.resolve(process.env.MASTRA_UPSTREAM_DIR ?? path.join(root, '..', 'github', 'mastra'))
const record = fs.readFileSync(path.join(root, 'UPSTREAM.md'), 'utf8')
const baseline = record.match(/Commit: `([0-9a-f]{40})`/)?.[1]
if (!baseline) throw new Error('UPSTREAM.md is missing its baseline commit')

const git = (directory, ...args) => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8' }).trim()

if (git(upstream, 'remote', 'get-url', 'origin') !== 'https://github.com/mastra-ai/mastra.git') {
  throw new Error(`Expected the official Mastra clone at ${upstream}`)
}

const head = git(upstream, 'rev-parse', 'HEAD')
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'UPSTREAM_INCREMENTAL.json'), 'utf8'))
const changes = git(upstream, 'diff', '--name-status', '--no-renames', baseline, head, '--', 'docs/src/content/en')
  .split('\n')
  .filter(Boolean)
  .map(line => {
    const [status, sourcePath] = line.split('\t')
    return { status, sourcePath, localPath: sourcePath.replace(/^docs\//, '') }
  })
const upstreamBlobs = new Map(
  git(upstream, 'ls-tree', '-r', 'HEAD', 'docs/src/content/en')
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [object, sourcePath] = line.split('\t')
      return [sourcePath, object.split(' ')[2]]
    }),
)
const recent = new Set(
  git(upstream, 'log', '--since=14.days', '--format=', '--name-only', '--', 'docs/src/content/en')
    .split('\n')
    .filter(Boolean)
    .map(file => file.replace(/^docs\//, '')),
)

const verified = []
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
  if (matches) verified.push(change.localPath)
  else pending.push(change.localPath)
}

console.log(`Official main: ${head}`)
console.log(`Baseline:      ${baseline}`)
pending.sort((a, b) => Number(recent.has(b)) - Number(recent.has(a)) || a.localeCompare(b))
console.log(`Changed English content files: ${changes.length} (${removed.length} removed)`)
console.log(`Verified English + zh-CN at current source: ${verified.length}`)
console.log(`Pending files: ${pending.length}; pending removals: ${removed.length}`)
console.log(`Pending files changed in the last 14 days: ${pending.filter(file => recent.has(file)).length}`)
for (const file of pending.slice(0, 20)) console.log(`  ${file}`)
if (pending.length > 20) console.log(`  ... and ${pending.length - 20} more`)
