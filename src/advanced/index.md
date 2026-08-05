---
title: Advanced
tier: advanced
platform: php
---

# Advanced PHP Tutorials

This tier takes the Intermediate tier's persisted JSON API and hardens it for real deployment — moving off `php -S` (which is explicitly not meant for production) onto a production-grade stack.

## Where This Is Headed

- **php-fpm + nginx** — the standard production pairing; nginx handles static/proxy concerns, php-fpm runs the actual PHP processes
- **Docker** — a multistage build producing a small, reproducible image
- **CI** — automated build/test/lint on every push, mirroring the GitHub Actions pattern already used to deploy this documentation site
- **Config and secrets** — environment-based configuration instead of hardcoded values

The concrete page ladder is tracked as follow-up work.

## Prerequisites

- Completed [Intermediate](/intermediate/) tier
- Comfortable with the persisted JSON API from that tier

Continue building once the ladder above lands.
