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

Incremental English and Simplified Chinese page updates are recorded in
`UPSTREAM_INCREMENTAL.json`. The commit above is the last **full English
import**; it does not imply that the whole site is current. Use
`scripts/report-upstream-progress.mjs` against a current official clone to
check which individual page pairs match the latest upstream source.

The incremental ledger distinguishes three commit records.
`translationBaseCommit` defines the comparison range for English and Simplified
Chinese work. Its current value is the original source snapshot, not proof that
every pre-existing translation was audited. `observedCommit` marks the latest
upstream commit whose changed-file list was inspected; it does not claim
translation is complete.
Each page's `sourceCommit` and `sourceBlob` identify the official content
reviewed for that page. The report recomputes the pending queue from the
translation base, so advancing the inspected commit or the full English
import cannot silently discard unfinished Chinese pages. A changed upstream
blob makes a previously reviewed page pending again.

## Incremental sync progress

As checked on 2026-11-14 against upstream `main` at
`8acea4cc5b97dcfd1e1179f9b40ca34c05f255cf`, three English and Simplified
Chinese page pairs are current: monorepo deployment, Workflow suspend/resume,
and `Run.startAsync()`. The comparison found 1,026 other changed English content
files and 236 removed upstream files still awaiting review. These counts are a
snapshot that includes English Learn pages; rerun the report for the current
queue.

The next batches should take recently changed pages with an existing Chinese
counterpart, update the English source and only the changed translated sections,
then record and verify both blobs. Review removals and route changes separately.
The existing full-snapshot sync remains available when a coordinated upgrade
is affordable. No production deployment is implied by this ledger.

On 2026-11-14, the four commits after `8acea4cc5b97dcfd1e1179f9b40ca34c05f255cf`
were inspected through `7277766d6c967c475675d58ff2d0e5c6d7be7c84`. One
commit changed `docs/src/content/en/docs/harness/durable-agents.mdx`; this page
has no English or Chinese counterpart in the mirror yet and remains pending.
The inspected commit was advanced without changing the three completed page
pairs or the translation base.
