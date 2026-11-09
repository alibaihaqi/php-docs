# Changelog

All notable changes to the PHP learning-docs site. Newest first.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## 2026-11-09 — chore: bump Node 26.4.0 -> 26.12.1

### Changed
- `.node-version` (and any hardcoded CI `node-version`) bumped 26.4.0 -> 26.12.1 for upstream Node security fixes.

## 2026-08-08 — fix: footer copyright year

### Fixed
- Footer copyright bumped `2023 - Present` -> `2026 - Present`.

## 2026-08-05 — feat: complete advanced tier

### Added
- Pages 01-08 of the Advanced tier: `01-why-production-hardening`,
  `02-jwt-auth`, `03-rate-limiting`, `04-php-fpm-and-nginx`, `05-docker`,
  `06-integration-tests`, `07-config-and-secrets`, `08-ci-cd-github-actions`.
  Adapted from `golang`'s advanced tier rather than mirrored 1:1 — PHP's
  shared-nothing model has no equivalent to graceful shutdown or
  connection-pool draining, addressed explicitly on page 01.
- Sidebar and `advanced/index.md`'s learning-path table updated for all 8 pages.

### Fixed (found via live verification, not just doc review)
- Dockerfile: `apk add sqlite-dev` before `docker-php-ext-install pdo_sqlite`
  — `php:8.3-fpm-alpine` has no SQLite dev headers by default, build fails
  without it.
- Two example `JWT_SECRET` values were shorter than `firebase/php-jwt`'s
  32-byte HS256 minimum (an uncaught `DomainException` -> 500 on login) —
  fixed both, added an explicit callout.
- Removed a `curl_close()` call from the integration test — no-op since
  PHP 8.0, deprecated as of 8.5.

## 2026-08-05 — feat: complete intermediate tier

### Added
- Pages 01-08 of the Intermediate tier, matching `golang`'s intermediate-tier
  sequence and page count: `01-why-persistence`, `02-project-setup`, `03-schema`,
  `04-store-layer`, `05-list-get-handlers`, `06-create-handler`, `07-config`,
  `08-tests`. Extends the beginner tier's `router.php` to a PDO/SQLite-backed
  CRUD API (`GET /items`, `GET /items/{id}`, `POST /items`), a store layer,
  env-based config, and a PHPUnit test suite.
- Sidebar and `intermediate/index.md`'s learning-path table updated for all 8 pages.

### Fixed
- All `require` calls (doc pages and the verified reference implementation)
  switched to `require_once` — plain `require` fatals with "cannot redeclare"
  once two entry points (both `08-tests.md` test files, via PHPUnit) load the
  same file in one process. Caught by live-running the tier's full code with a
  local PHP 8.5.9 + Composer install, not just eyeballing it.

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
