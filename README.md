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

The project workflow for incremental English and Simplified Chinese updates is
in [.codex/skills/mastra-doc-sync/SKILL.md](./.codex/skills/mastra-doc-sync/SKILL.md).
The source baseline and progress are in [UPSTREAM.md](./UPSTREAM.md) and
`UPSTREAM_INCREMENTAL.json`. Clone the official source once:

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

Set `MASTRA_UPSTREAM_DIR` when the official clone is elsewhere. The report
accepts `--json` for the full queue and `--since=COMMIT` for a narrower Git
comparison. For a coordinated full English import, use the clean
`codex/mastra-latest-docs` branch required by the existing script:

```bash
pnpm sync:upstream
```

The full import follows upstream `main`; the project skill explains its review
and locale boundary.

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
