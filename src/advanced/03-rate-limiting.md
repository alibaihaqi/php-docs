---
title: 03 Rate Limiting
tier: advanced
platform: php
---

# 03 Rate Limiting

## Goal

Add a per-IP fixed-window rate limit, backed by the same SQLite database the API already uses.

## Prerequisites

- [JWT Auth](./02-jwt-auth)

## Why SQLite, Not an In-Process Counter

The obvious-looking approach — a PHP array counting requests per IP — doesn't work here. Recall from [PHP Language — Why PHP](/php-language/01-why-php): every request gets a fresh interpreter run, so any variable declared at file scope is reset to empty on the very next request. There is no process memory that survives between requests to count *against*. Rate limiting state has to live somewhere that outlives a single request — the database this API already has, in this case.

## Fixed-Window Algorithm

This tier uses a **fixed window**: divide time into fixed-size buckets (e.g. every 60 seconds), count requests per IP within the current bucket, reject once the count exceeds the limit. Simpler than a sliding window or token bucket, and precise enough for this tier's needs — the tradeoff (a client can burst up to `2× limit` right at a window boundary) is a known, acceptable limitation of fixed windows, not a bug.

## The Rate Limit Table and Check

Create `ratelimit.php`:

```php
<?php

function ensureRateLimitTable(PDO $pdo): void {
    $pdo->exec('CREATE TABLE IF NOT EXISTS rate_limits (
        ip TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        window_start INTEGER NOT NULL
    )');
}

function checkRateLimit(PDO $pdo, string $ip, int $limit, int $windowSeconds): bool {
    $now = time();
    $windowStart = $now - ($now % $windowSeconds);

    $stmt = $pdo->prepare('SELECT count, window_start FROM rate_limits WHERE ip = ?');
    $stmt->execute([$ip]);
    $row = $stmt->fetch();

    if ($row === false || (int) $row['window_start'] !== $windowStart) {
        $upsert = $pdo->prepare(
            'INSERT INTO rate_limits (ip, count, window_start) VALUES (?, 1, ?)
             ON CONFLICT(ip) DO UPDATE SET count = 1, window_start = excluded.window_start'
        );
        $upsert->execute([$ip, $windowStart]);
        return true;
    }

    if ((int) $row['count'] >= $limit) {
        return false;
    }

    $update = $pdo->prepare('UPDATE rate_limits SET count = count + 1 WHERE ip = ?');
    $update->execute([$ip]);
    return true;
}
```

`$now - ($now % $windowSeconds)` rounds the current timestamp down to the start of its window — every request within the same 60-second bucket computes the same `$windowStart`. When the stored row's `window_start` doesn't match the current one, the previous window has expired and the counter resets via `INSERT ... ON CONFLICT DO UPDATE` (SQLite's upsert syntax) rather than a separate check-then-insert/update — one statement, no race between the check and the write.

## Wiring

Add the check to the very top of `router.php`'s dispatch, before any route matching — a rate-limited request should never reach handler logic at all:

```php
<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/handlers.php';
require_once __DIR__ . '/ratelimit.php';

header('Content-Type: application/json');

$path = getenv('ITEMS_DB') ?: 'items.db';
$pdo = openDb($path);
ensureRateLimitTable($pdo);

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!checkRateLimit($pdo, $ip, limit: 5, windowSeconds: 60)) {
    http_response_code(429);
    echo json_encode(["error" => "rate limit exceeded"]);
    exit;
}

// ... existing route dispatch below, unchanged
```

`limit: 5, windowSeconds: 60` uses PHP's named-argument syntax (from [05 Functions](/beginner/05-functions)) to make the two numbers self-documenting at the call site, rather than two bare integers a reader has to cross-reference against the function signature.

## Checkpoint

```bash
php -S localhost:8000 router.php
```

In a second terminal, fire 7 requests in a row:

```bash
for i in 1 2 3 4 5 6 7; do
  curl -s -o /dev/null -w "request $i: %{http_code}\n" http://localhost:8000/items
done
```

Expected (limit is 5 per 60-second window):

```
request 1: 200
request 2: 200
request 3: 200
request 4: 200
request 5: 200
request 6: 429
request 7: 429
```

Stop the server with `Ctrl-C`.

## Next

Continue to [04 php-fpm and Nginx](./04-php-fpm-and-nginx).
