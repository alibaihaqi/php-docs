---
title: 07 Config and Secrets
tier: advanced
platform: php
---

# 07 Config and Secrets

## Goal

Consolidate the scattered `getenv()` calls from earlier pages into one `config()` function, make the rate limit configurable, and establish where real secrets actually come from in each environment this API runs in.

## Prerequisites

- [Integration Tests](./06-integration-tests)

## What's Scattered Right Now

By this point, `router.php` reads three separate environment variables in three separate places: `ITEMS_DB` (page 07 of Intermediate), `JWT_SECRET` (inside `auth.php`'s `jwtSecret()`), and the rate limit's `5`/`60` are hardcoded literals, not configurable at all. None of that is wrong, exactly, but it means "what can I configure about this API" isn't answerable by reading one place.

## One Config Function

Create `config.php`:

```php
<?php

function config(): array {
    return [
        'db_path' => getenv('ITEMS_DB') ?: 'items.db',
        'jwt_secret' => getenv('JWT_SECRET') ?: 'dev-secret-do-not-use-in-production',
        'rate_limit' => (int) (getenv('RATE_LIMIT') ?: 5),
        'rate_limit_window' => (int) (getenv('RATE_LIMIT_WINDOW') ?: 60),
    ];
}
```

Every configurable value the API has, in one array, with its default alongside it. `(int)` matters on the two rate-limit values — `getenv()` always returns a string (or `false`), and `checkRateLimit`'s parameters are typed `int`; without the cast, a set `RATE_LIMIT` environment variable would pass a numeric *string* where PHP's type declarations expect an `int` — which happens to still work today via PHP's [gradual typing](/beginner/03-variables-and-types) coercion in non-strict mode, but is exactly the kind of implicit coercion that tier warned against relying on.

Update `auth.php` to use it instead of its own `getenv` call:

```php
function jwtSecret(): string {
    return config()['jwt_secret'];
}
```

Update `router.php`'s top to read from `config()`:

```php
<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/handlers.php';
require_once __DIR__ . '/ratelimit.php';

header('Content-Type: application/json');

$cfg = config();
$pdo = openDb($cfg['db_path']);
ensureRateLimitTable($pdo);

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!checkRateLimit($pdo, $ip, $cfg['rate_limit'], $cfg['rate_limit_window'])) {
    http_response_code(429);
    echo json_encode(["error" => "rate limit exceeded"]);
    exit;
}

// ... route dispatch unchanged below
```

## Where Secrets Actually Come From, Per Environment

This tier never introduces a `.env` file or a secrets-loading library (`vlucas/phpdotenv` and similar exist, but this API's needs are covered without one) — `getenv()` reading real process environment variables is enough, because every environment this API runs in already has a place to inject those variables:

| Environment | Where `JWT_SECRET` etc. come from |
|---|---|
| Local dev | Exported in your shell, or `docker-compose.yml`'s `environment:` block (fine for placeholder values only) |
| CI | The tracker's own secrets store — `secrets.JWT_SECRET` in GitHub Actions (see [08 CI/CD](./08-ci-cd-github-actions)) |
| Production | Whatever your host/orchestrator injects as environment variables (a Kubernetes `Secret`, a platform's env-var dashboard, etc.) |

**The rule that hasn't changed since [02 Project Setup](/intermediate/02-project-setup)**: this is a public repo. `docker-compose.yml`'s `JWT_SECRET: change-me-in-production-min-32-bytes-required` value is a committed placeholder, not a real secret — it's fine to commit precisely because it's not the value anything real uses. A real deployment overrides it via the environment, never by editing that file with the actual secret.

## Checkpoint

```bash
RATE_LIMIT=2 RATE_LIMIT_WINDOW=60 php -S localhost:8000 router.php
```

In a second terminal:

```bash
for i in 1 2 3; do
  curl -s -o /dev/null -w "request $i: %{http_code}\n" http://localhost:8000/items
done
```

Expected (limit lowered to 2 via the environment):

```
request 1: 200
request 2: 200
request 3: 429
```

Stop the server with `Ctrl-C`.

## Next

Continue to [08 CI/CD GitHub Actions](./08-ci-cd-github-actions).
