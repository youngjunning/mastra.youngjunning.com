---
name: mastra-doc-sync
description: Plan and perform incremental English, Simplified Chinese, Taiwan Traditional Chinese, and Hong Kong Traditional Chinese documentation updates in this Mastra mirror from official upstream main. Use when checking upstream changes, choosing a sync batch, updating the source ledger, or assessing sync progress. For translation alone, use the translation skill.
---

# Sync Mastra documentation

Keep this mirror's selected English pages and their `zh-CN`, `zh-TW`, and `zh-HK` counterparts aligned with the **latest upstream page content**. A commit identifies a comparison range; it is not a unit of translation. Pages that changed repeatedly should be reviewed once against the chosen upstream `HEAD`.

## Sources of truth

- `UPSTREAM.md` records the last complete **English import**, not a claim that every locale is current. `UPSTREAM_INCREMENTAL.json` stores `translationBaseCommit`, a complete content-fingerprint snapshot, and independent AI-polish evidence for every English/Chinese page set. Source/locale hash freshness does not imply editorial completion.
- `scripts/report-upstream-progress.mjs` compares the official clone with that base and checks page blobs. Its default scope is `src/content/en` plus top-level English Learn pages. Course content and other locales need separate assessment.
- `sourceBlob` is the official English blob reviewed for a page. `englishBlob` records a necessary local adaptation; without it the local English file must match `sourceBlob`. The locale path and blob fields detect later edits to each Chinese page. `aiPolish.reviewedPages` is valid only when both its recorded source blob and locale blob still match. Matching translation hashes show file freshness; matching AI-polish hashes show that the required second-pass review still applies. New upstream changes are the difference between `translationBaseCommit` and the selected upstream `HEAD`.

## Incremental batch

1. Read the repository's `AGENTS.md`, `UPSTREAM.md`, ledger, and current working tree. Preserve unrelated edits. Refresh the official clone as described in `README.md`, then pin the upstream `HEAD` used for this batch.
2. Run `node scripts/report-upstream-progress.mjs` with `MASTRA_UPSTREAM_DIR` if needed. Use `--json` for the full queue. Use `--since=COMMIT` only to investigate a shorter Git range; there is no inspection cursor to advance. Choose pages by the user's priority and reader impact, including linked pages or navigation that the change requires.
3. For a previously reviewed page, compare its recorded `sourceBlob` with the current upstream blob; otherwise compare `translationBaseCommit` with `HEAD`. Update the English page to the latest upstream content, retaining only necessary mirror-specific route or site adaptations. Read [translation](../translation/SKILL.md) before editing Chinese. Reuse each locale's existing translation and revise the changed meaning, code, links, headings, and qualifications after checking the complete latest English page. Translate all three Chinese locales independently from English, then run the required AI editorial pass for each locale. A machine-translated page without valid AI-polish evidence remains pending.
4. Treat new pages, moves, and removals as route changes. Check sidebars, links, assets, and redirects; use the repository's move/delete scripts where applicable. Model provider pages are generated, so follow the existing generators instead of manually editing their English source.
5. After every changed page and removal is translated, run `scripts/update-upstream-ledger.mjs` to rebuild the complete snapshot with the upstream `sourceBlob`, each Chinese locale path and blob, and optional local `englishBlob`. The script preserves AI-polish evidence only while its source and locale blobs still match, so changed pages re-enter the polish queue automatically. Do not call a locale complete or advance its editorial status while any required AI-polish item remains pending. Update the dated progress in `UPSTREAM.md` and state translation freshness and editorial completion separately.
6. Run the progress report again and confirm the selected pairs match their recorded hashes. Validate with the affected locale's anchor check, `pnpm validate`, and the relevant prose checks; build when MDX structure, routes, or site configuration changed. Distinguish source matching, translation review, local build, push, and live deployment in the handoff.

## Full English import

The existing `pnpm sync:upstream` command requires its specified branch and a clean working tree. Inspect its protected paths before running it. It preserves localized files and advances only the English import recorded in `UPSTREAM.md`. Keep `translationBaseCommit` until the corresponding Chinese changes and removals have been reviewed; a full English copy does not complete bilingual sync.
