# Upstream source

- Repository: https://github.com/mastra-ai/mastra
- Branch: `main`
- Commit: `f33264f517ae603279afd5c4251e2b40f6dd3618`
- Synced: 2026-08-09
- Imported path: `docs/`

The imported content contains only the current documentation snapshot. It does
not vendor Mastra's Git history, release branches, tags, or a versioned docs
site. The landing page, domain, analytics, and deployment configuration are
maintained locally.

Incremental English and Simplified Chinese page state is recorded in
`UPSTREAM_INCREMENTAL.json`. The commit above is the last **full English
import**; it does not imply that every locale is current. The comparison base
and page blobs in the ledger serve different purposes; the project workflow is
in [.codex/skills/mastra-doc-sync/SKILL.md](./.codex/skills/mastra-doc-sync/SKILL.md).

## Incremental sync progress

As checked on 2026-11-14 against upstream `main` at
`8acea4cc5b97dcfd1e1179f9b40ca34c05f255cf`, three English and Simplified
Chinese page pairs are current: monorepo deployment, Workflow suspend/resume,
and `Run.startAsync()`. The comparison found 1,026 other changed English content
files and 236 removed upstream files still awaiting review. These counts are a
snapshot that includes English Learn pages; rerun the report for the current
queue.

The backlog remains for future batches. This record describes source and
progress; it does not imply a production deployment.

On 2026-11-14, the upstream range
`8acea4cc5b97dcfd1e1179f9b40ca34c05f255cf..7277766d6c967c475675d58ff2d0e5c6d7be7c84`
included one English documentation change, to
`docs/src/content/en/docs/harness/durable-agents.mdx`. This page has no English
or Chinese counterpart in the mirror yet and remains pending.
