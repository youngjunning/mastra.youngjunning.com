# Mastra site mirror

This branch deploys a complete Mastra landing page together with a tracked
documentation snapshot from the official
[mastra-ai/mastra](https://github.com/mastra-ai/mastra) repository.

The documentation source is imported from upstream `main/docs` without old
release branches or a multi-version documentation setup. See [UPSTREAM.md](./UPSTREAM.md)
for the exact synced commit.

The landing page is maintained locally because Mastra's marketing website
source is not public. The documentation remains an upstream snapshot and is
updated only from `main/docs`.

This is an independent deployment mirror and is not the official Mastra site.
The official website is available at [mastra.ai](https://mastra.ai).

The site publishes Simplified Chinese at the root URL, plus English, Japanese,
Taiwan Traditional Chinese, and Hong Kong Traditional Chinese under localized
paths. The language switcher preserves the current page and the visitor's most
recent language choice.

## Development

Requires Node.js 22 or later and pnpm 11 or later.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` builds and serves every locale so language switching works across
the complete site. For faster hot-reload development of only the Simplified
Chinese locale, run `pnpm dev:fast`. The other single-locale commands are
`pnpm dev:en`, `pnpm dev:ja`, `pnpm dev:zh-TW`, and `pnpm dev:zh-HK`.

Build the production site with:

```bash
pnpm build
```

The static output is written to `build/`.

## Sync the latest upstream docs

For a lower-cost English and Simplified Chinese update, compare the official
clone with the translation comparison base before selecting a small batch.
Clone once:

```bash
mkdir -p ../github
git clone --filter=blob:none --sparse https://github.com/mastra-ai/mastra.git ../github/mastra
git -C ../github/mastra sparse-checkout set docs
```

Before each batch, update the clone and inspect the current backlog:

```bash
git -C ../github/mastra fetch origin main
git -C ../github/mastra switch main
git -C ../github/mastra pull --ff-only origin main
node scripts/report-upstream-progress.mjs
```

Set `MASTRA_UPSTREAM_DIR` when the official clone is elsewhere. Use `--json`
for the complete machine-readable change queue. The report compares
`translationBaseCommit..HEAD` and verifies the current upstream file blob
against each recorded English and Chinese page pair. Use `--since=COMMIT` only
when you need to inspect the commits and changed files in a shorter range.
There is no persistent inspection cursor. It covers `src/content/en` and the
English top-level pages in `src/learn/content`; the course and other locales
need separate tracking. Unchanged pages from the comparison base are not
audited by this report.

For each selected page, update its English source and only the changed sections
of its corresponding Simplified Chinese page (`i18n/zh-CN` for docs,
`src/learn/content/zh-CN` for Learn). Record the upstream `sourceBlob` and
Chinese `zhCNBlob`. If local site integration needs an adaptation, also record
the local `englishBlob`. A matching blob proves the files have not changed
since review; it does not assess translation quality. When the upstream page
changes again, the pair returns to the pending queue. Review deletions and
renames separately.

The full snapshot command remains available for a coordinated upgrade:

Keep the official clone at `../github/mastra` and use the clean
`codex/mastra-latest-docs` branch required by the existing full-sync script:

```bash
pnpm sync:upstream
```

Set `MASTRA_UPSTREAM_DIR` if the official clone is stored elsewhere. The sync
command follows only upstream `main`. It stops for manual review if upstream
changed files that contain this mirror's domain or analytics adaptations.
It preserves localized files and advances only the English import commit in
`UPSTREAM.md`. Advance `translationBaseCommit` only after the corresponding
Chinese content and removals have been reviewed. The current base is the
original imported source commit; it does not certify every existing Chinese
translation at that commit.

## Deployment environment

Set these values only on the production deployment:

```bash
DEPLOY_ENV=production
SITE_URL=https://mastra.youngjunning.com
GA_ID=G-XSL4QXVXDB
```

Google Search Console ownership is verified by
`static/googled29fba422c357ff8.html`.

## License

The imported Mastra documentation is distributed under the Apache License 2.0.
See [LICENSE.md](./LICENSE.md).
