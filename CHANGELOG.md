# Changelog

All notable changes to the PHP learning-docs site. Newest first.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## 2026-08-05 — feat: complete beginner tier

### Added
- Pages 02-10 of the Beginner tier, matching `golang`'s beginner-tier sequence and
  page count: `02-hello-world`, `03-variables-and-types`, `04-control-flow`,
  `05-functions`, `06-arrays`, `07-classes`, `08-hello-http`, `09-json-encoding`,
  `10-serving-json`. Completes the JSON HTTP API artifact this tier builds toward —
  a `router.php`-based API (`GET /items`, `GET /items/{id}`) on `php -S`, no framework.
- Sidebar and `beginner/index.md`'s learning-path table updated for all 10 pages.

## 2026-08-05 — feat: scaffold + skeleton content across six tiers

### Added
- VitePress 1.6.4 scaffold (`.vitepress/config.mts`, `package.json`, `.node-version`,
  `.gitignore`) and a GitHub Pages deploy workflow (`.github/workflows/deploy.yml`),
  mirroring the `rust` platform's shape.
- Six tiers scaffolded with a working `index.md` each: `introduction` (+ `getting-started.md`),
  `beginner` (+ `01-install-php.md`, starting the JSON HTTP API artifact), `intermediate`,
  `advanced` (index-only, artifact continuation planned as follow-up work), `php-language`
  (+ `01-why-php.md`, fundamentals deep-dive), `cli-tool` (+ `01-hello-cli.md`, a second
  build-along artifact).
- Root `CLAUDE.md`, `README.md`, and this changelog.
