# Changelog

All notable changes to the PHP learning-docs site. Newest first.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

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
