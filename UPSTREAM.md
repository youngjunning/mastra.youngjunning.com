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
`UPSTREAM_INCREMENTAL.json`. The commit above remains the **full-import**
baseline; it does not imply that the whole site is current. Use
`scripts/report-upstream-progress.mjs` against a current official clone to
check which individual page pairs match the latest upstream source.

## Incremental sync progress

As checked on 2026-11-14 against upstream `main` at
`8acea4cc5b97dcfd1e1179f9b40ca34c05f255cf`, three English and Simplified
Chinese page pairs are current: monorepo deployment, Workflow suspend/resume,
and `Run.startAsync()`. The comparison found 1,010 other changed English content
files and 236 removed upstream files still awaiting review. These counts are a
snapshot; rerun the report for the current queue.

The next batches should take recently changed pages with an existing Chinese
counterpart, update the English source and only the changed translated sections,
then record and verify both blobs. Review removals and route changes separately.
The existing full-snapshot sync remains available when a coordinated upgrade
is affordable. No production deployment is implied by this ledger.
