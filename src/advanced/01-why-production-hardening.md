---
title: 01 Why Production Hardening
tier: advanced
platform: php
---

# 01 Why Production Hardening

## Goal

Understand what the intermediate tier's API is still missing for production, and what this tier does — and does *not* — need to add, given PHP's shared-nothing request model.

## Prerequisites

- [Intermediate — Tests](/intermediate/08-tests) (the tier exit artifact)

## What's Missing

The intermediate tier's `php -S`-served API has three real production gaps:

1. **`php -S` says so itself.** PHP's own docs call the built-in server explicitly unsuitable for production — it's single-threaded and has no process management.
2. **No authentication.** `POST /items` is open to anyone who can reach it.
3. **No abuse protection.** Nothing stops one client from hammering the API.

## What This Tier Adds

- **JWT auth** — a `/login` endpoint issues a bearer token; `POST /items` requires one
- **Rate limiting** — per-IP request caps, enforced via SQLite (the same store this API already has)
- **php-fpm + nginx** — the standard production pairing, replacing `php -S`
- **Docker** — a reproducible multi-container image (php-fpm + nginx)
- **Integration tests** — PHPUnit driving a real running server, not just direct function calls
- **CI** — lint, test, and build on every push

## What This Tier Deliberately Skips — and Why

Sibling platforms' advanced tiers (see `golang`) add graceful shutdown (drain in-flight requests on `SIGTERM`, close connections cleanly) and connection pooling. Neither applies here in the same shape, and it's worth understanding why rather than treating the omission as an oversight.

Recall from [PHP Language — Why PHP](/php-language/01-why-php): PHP's shared-nothing model means **there is no long-running process holding open connections between requests** the way a Go or Node server does — php-fpm spawns a worker per request, the worker runs your script to completion, and it exits. There's no in-flight-request state to drain on shutdown, and no connection pool to close, because neither exists across requests in the first place. php-fpm's own process manager (`pm.max_requests`, graceful worker recycling) already handles the analogous concern at the *process pool* level — that's php-fpm's job, not application code's, which is precisely why it replaces `php -S` in this tier rather than something you write yourself.

## Next

Continue to [02 JWT Auth](./02-jwt-auth).
