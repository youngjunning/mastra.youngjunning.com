---
name: translation
description: Translate and review selected Mastra technical documentation from English into Simplified Chinese (zh-CN), Taiwan Traditional Chinese (zh-TW), Hong Kong Traditional Chinese (zh-HK), and Japanese (ja). Use for localized Markdown and MDX content and quality checks; upstream version tracking and sync batches use mastra-doc-sync.
---

# Translate Mastra documentation

Translate technical content accurately and naturally without changing its behavior or structure.

For upstream change detection and batch selection, read [mastra-doc-sync](../mastra-doc-sync/SKILL.md) first.

## Target locales

| Locale | Requirements |
| --- | --- |
| `zh-CN` | Use natural Simplified Chinese and terminology common in mainland China. |
| `zh-TW` | Use Traditional Chinese and Taiwan terminology. Do not mechanically convert `zh-CN`. |
| `zh-HK` | Use Traditional Chinese and Hong Kong terminology. Do not reuse mainland or Taiwan wording without checking local usage. |
| `ja` | Use concise, natural Japanese technical writing; avoid literal English word order. |

Translate every locale independently from the English source. Preserve the same technical meaning across all locales while allowing native phrasing.

## Workflow

1. Read `AGENTS.md`, `CONTRIBUTING.md`, the applicable styleguide, and the complete English source page before translating.
2. Inspect existing localized pages and project configuration to determine the locale directory and route mapping. If no mapping exists, confirm it before creating the first localized page.
3. Reuse established terminology from nearby localized pages. Keep product names, package names, API names, and branded terms unchanged unless the repository already defines a translation.
4. Translate user-facing prose, headings, table text, image alt text, admonition content, and user-visible string values in MDX props.
5. Compare the translation with the English source paragraph by paragraph. Do not omit qualifications, prerequisites, warnings, examples, or limitations, and do not add unsupported claims.
6. Review each locale separately for fluency and regional appropriateness. Never treat script conversion as localization.

## Terminology policy

Preserve established English technical terms when translating them would be uncommon, ambiguous, or less recognizable to developers. Do not force literal translations merely to maximize the amount of localized text.

- Keep Mastra concepts such as `Agent`, `Workflow`, `MCP`, `Studio`, `Provider`, `Trace`, `Evals`, `Tool`, `Skill`, `Sandbox`, and `Workspace` in English by default.
- Keep product names, protocol names, library and framework names, API symbols, class and method names, package names, CLI names, and branded feature names in English.
- Translate the surrounding explanation so the sentence remains natural in the target locale. On first use, add a short localized explanation only when the English term may be unclear.
- Follow an existing repository glossary or established localized usage when one exists. Prefer consistency over introducing a new translation.
- Do not alternate between an English term and multiple localized equivalents on the same page.

## Preserve exactly

- Frontmatter keys, package names, IDs, slugs, and non-prose metadata. Translate only user-facing values such as `title` and `description` when the locale format expects them.
- Imports, exports, JSX component names, prop names, expressions, and structural markup. Translate only clearly user-visible string prop values; preserve semantic values such as tab IDs.
- Fenced code contents and fence metadata, inline code, commands, file paths, identifiers, environment variables, JSON keys, URLs, and package names unless the request explicitly requires localized code comments or sample data.
- Markdown link destinations, explicit anchors, reference labels, and image paths. Translate visible link text and alt text.
- Placeholder tokens from `src/plugins/remark-model-tokens/models.ts`, including every `__TOKEN__` form. Never replace a token with a concrete model ID in translated docs.
- Admonition markers, tab structure, property-table schemas, and other MDX component structure.

Do not edit `src/content/en/models/`; model provider documentation is auto-generated. When an English page moves or is deleted, follow the repository scripts and redirect workflow instead of manually recreating those operations.

## Translation quality

- Prefer meaning and task clarity over word-for-word correspondence.
- Keep technical terminology consistent within and across pages.
- Preserve modality precisely: distinguish must, should, may, defaults, recommendations, and guarantees.
- Keep sentences direct and scannable. Avoid unnecessary transliteration, decorative wording, and mixed regional vocabulary.
- Preserve intentional English UI labels when they identify literal controls, fields, or API values; add a localized explanation when needed.
- Flag ambiguous source text rather than guessing.

## Verification

Before finishing:

1. Compare headings, lists, tables, admonitions, links, code fences, and MDX tags against the English source for missing or extra structure.
2. Search the changed files for altered model tokens, code identifiers, and accidental cross-locale vocabulary.
3. After translating headings, run `node scripts/sync-localized-heading-anchors.mjs --locale=<locale>` so the selected locale retains the English source anchor IDs, then check it with `node scripts/sync-localized-heading-anchors.mjs --check --locale=<locale>`.
4. Run the narrowest relevant repository checks. For a documentation batch, prefer `pnpm validate` and `pnpm lint:prose`; run `pnpm build` when routing, MDX structure, or shared configuration changes.
5. Report any source ambiguity, untranslated intentional text, skipped generated content, or checks that could not run.
