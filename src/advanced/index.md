---
title: Advanced
tier: advanced
platform: php
---

# Advanced PHP Tutorials

This tier takes the Intermediate tier's persisted JSON API and hardens it for real deployment — moving off `php -S` (which is explicitly not meant for production) onto a production-grade stack.

## What You'll Build

JWT auth on `POST /items`, SQLite-backed per-IP rate limiting, php-fpm + nginx replacing `php -S`, a multistage Docker build, an HTTP-level integration test suite, consolidated env-based config, and a GitHub Actions CI/CD workflow.

## Learning Path

| # | Tutorial | Concepts |
|---|----------|----------|
| 01 | [Why Production Hardening](./01-why-production-hardening) | What's missing, and why PHP skips graceful shutdown/pprof |
| 02 | [JWT Auth](./02-jwt-auth) | `firebase/php-jwt`, bearer tokens, minimum key length |
| 03 | [Rate Limiting](./03-rate-limiting) | Fixed-window, SQLite-backed (shared-nothing means no in-process counter) |
| 04 | [php-fpm and Nginx](./04-php-fpm-and-nginx) | FastCGI, pool config, the `Authorization` header gotcha |
| 05 | [Docker](./05-docker) | Multistage build, `sqlite-dev`, docker-compose |
| 06 | [Integration Tests](./06-integration-tests) | Real `php -S` subprocess, `curl` extension |
| 07 | [Config and Secrets](./07-config-and-secrets) | One `config()`, secrets per environment |
| 08 | [CI/CD GitHub Actions](./08-ci-cd-github-actions) | Lint, test, build, push to GHCR |

## Prerequisites

- Completed [Intermediate](/intermediate/) tier
- Comfortable with the persisted JSON API from that tier
- Docker installed (`docker --version`)

Start with [01 Why Production Hardening](./01-why-production-hardening).
