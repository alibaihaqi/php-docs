---
title: 08 CI/CD GitHub Actions
tier: advanced
platform: php
---

# 08 CI/CD GitHub Actions

## Goal

Add a GitHub Actions workflow that lints, tests, and builds the Docker image on every push — and pushes the image to GitHub Container Registry on `main`.

## Prerequisites

- [Config and Secrets](./07-config-and-secrets)
- A GitHub repository with this project pushed

## The Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          extensions: pdo, pdo_sqlite

      - name: Install dependencies
        run: composer install --no-interaction --prefer-dist

      - name: Lint
        run: |
          for f in $(find . -name "*.php" -not -path "./vendor/*"); do
            php -l "$f"
          done

      - name: Unit and integration tests
        run: vendor/bin/phpunit

  docker:
    if: github.ref == 'refs/heads/main'
    needs: ci
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
```

A few points worth calling out:

- **`shivammathur/setup-php`** is the standard community action for installing PHP in CI with specific extensions — `pdo_sqlite` needs to be explicitly requested here the same way it needed `apk add sqlite-dev` in the [Dockerfile](./05-docker); CI runners don't ship it by default either.
- **The lint step is a shell loop, not a single command** — PHP has no built-in "lint the whole project" command; `php -l` only checks one file at a time. `find ... -not -path "./vendor/*"` excludes the dependency tree, which is already-published code with no need to re-lint.
- **No `services:` sidecar block.** golang's advanced tier CI runs a Postgres *service container* alongside the test job because its tests need a real Postgres instance. This project's tests (both the intermediate tier's PHPUnit suite and this tier's integration test) create their own SQLite file per run — no external service to wait on or configure.
- **`secrets.GITHUB_TOKEN`** is injected automatically by GitHub Actions for every workflow run — no manual secret setup needed to push to GHCR. A real `JWT_SECRET` for a deployed instance would go through the same `secrets.*` mechanism (referenced from [07 Config and Secrets](./07-config-and-secrets)), just not needed by this workflow itself since CI never runs the app against a real JWT-protected deployment.
- **Docker push runs only on `main`**, after the `ci` job passes (`needs: ci`) — a PR branch builds and tests but never publishes an image.

## Checkpoint

Push to GitHub and open the Actions tab:

```bash
git push origin main
```

Open `https://github.com/<user>/<repo>/actions` — the workflow should show:

1. PHP setup with `pdo_sqlite`
2. `composer install`
3. Every `.php` file lint-clean
4. The full PHPUnit suite (intermediate tier's tests + this tier's integration test) green
5. On `main`: the Docker image built and pushed to `ghcr.io/<user>/<repo>`

---

## You Finished the Advanced Tier. What's Next?

You now have a JWT-authenticated, rate-limited, PDO/SQLite-backed API running on php-fpm + nginx via Docker, with integration tests and CI/CD — no framework, from `<?php echo "hello";` all the way here. This is also the end of the JSON HTTP API artifact's ladder on this site — the [CLI Tool](/cli-tool/) and [PHP Language](/php-language/) tracks continue independently.
