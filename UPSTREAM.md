# Upstream source

- Repository: https://github.com/mastra-ai/mastra
- Branch: `main`
- Commit: `7277766d6c967c475675d58ff2d0e5c6d7be7c84`
- Synced: 2026-11-14
- Imported path: `docs/`

The imported content contains only the current documentation snapshot. It does
not vendor Mastra's Git history, release branches, tags, or a versioned docs
site. The landing page, domain, analytics, and deployment configuration are
maintained locally.

Incremental English, Simplified Chinese, Taiwan Traditional Chinese, and Hong
Kong Traditional Chinese page state is recorded in
`UPSTREAM_INCREMENTAL.json`. The commit above is the last **full English
import**. Locale freshness is established separately by the recorded page
blobs; the project workflow is in
[.codex/skills/mastra-doc-sync/SKILL.md](./.codex/skills/mastra-doc-sync/SKILL.md).

## Incremental sync progress

On 2026-11-14, the English snapshot and the machine-translated Simplified
Chinese, Taiwan Traditional Chinese, and Hong Kong Traditional Chinese files
were updated through upstream `main` commit
`7277766d6c967c475675d58ff2d0e5c6d7be7c84`. The ledger records 1,024 current
page sets across the three Chinese locales. The source/translation comparison
queue contains no pending content files or removals at this baseline.

On 2026-11-15, the required AI editorial pass was completed for all 1,024 page
sets in `zh-CN`, `zh-TW`, and `zh-HK`. Each localized page was reviewed against
the English source after machine translation, with its reviewed source and
locale blobs recorded in the incremental ledger. All three locales therefore
have 1,024 reviewed page sets and no pending AI-polish work at this baseline.
Build, MDX, terminology, and heading-anchor validation remain separate quality
checks; they do not replace the editorial gate. Translation freshness and
AI-polish completion are tracked independently so an unchanged reviewed page
can be reused while a changed source or locale blob automatically returns to the
polish queue.

This record describes source and localization state; it does not imply a
production deployment.
