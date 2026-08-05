# PHP Learning Docs

> Public VitePress documentation site published to GitHub Pages. Part of the
> learning-docs hub.

> **Read [`CHANGELOG.md`](./CHANGELOG.md) first** — it summarizes what has been
> added over time (tiers, CI changes) so you have context before reading the code.

## Content model
- Content lives in `src/`. Six tiers: `introduction`, `beginner`, `intermediate`,
  `advanced`, `php-language`, `cli-tool`.
- `beginner`/`intermediate`/`advanced` build ONE concrete artifact: a small JSON
  HTTP API using PHP's built-in server (beginner), extended with a persistence
  layer (intermediate), hardened for deployment (advanced).
- `php-language` is a fundamentals deep-dive, independent of the artifact ladder
  — language mechanics topic by topic (mirrors `rust-language`/`go-language` in
  sibling platforms).
- `cli-tool` is a second, independent build-along artifact: a small command-line
  PHP tool with no framework.
- Tier `index.md` frontmatter: `title`, `tier`, `platform: php`.

## Add a page
1. Create `src/<tier>/NN-title.md` with a goal, steps with complete code, and a
   runnable checkpoint (command + expected output).
2. Add it to the tier `index.md` ladder and to the sidebar in
   `.vitepress/config.mts`.

## Add a tier
New `src/<tier>/` + `index.md` (frontmatter) + a sidebar group + a home feature
card in `src/index.md`.

## Build
- `pnpm install`
- `pnpm docs:build`
- `pnpm docs:preview`

## RULE — this repo is PUBLIC
Never commit secrets, API keys, credentials, tokens, or personal data. Examples
use placeholders only (`YOUR_KEY`, `example.com`).
