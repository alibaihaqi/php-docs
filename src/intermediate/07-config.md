---
title: 07 Config
tier: intermediate
platform: php
---

# 07 Config

## Goal

Make the database path configurable via an environment variable, and assemble the complete `router.php`. After this page you have the full runnable server.

## Prerequisites

- [Create Handler](./06-create-handler) — all three handlers wired to the router

## Environment Variable Config

Hardcoding `'items.db'` in `router.php` means every environment — local dev, tests, production — shares the same file path. A single environment variable (`ITEMS_DB`) fixes that: the caller sets a path, the script falls back to `items.db` if the variable is absent.

```php
$path = getenv('ITEMS_DB') ?: 'items.db';
```

`getenv()` returns `false` (not `null`) when a variable is unset — the `?:` short ternary treats `false` the same as an empty string here, applying the default.

## The Complete `router.php`

```php
<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/handlers.php';

header('Content-Type: application/json');

$path = getenv('ITEMS_DB') ?: 'items.db';
$pdo = openDb($path);

$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && $requestPath === '/items') {
    [$status, $body] = handleList($pdo);
} elseif ($method === 'GET' && preg_match('#^/items/(\d+)$#', $requestPath, $matches)) {
    [$status, $body] = handleGet($pdo, $matches[1]);
} elseif ($method === 'POST' && $requestPath === '/items') {
    $input = json_decode(file_get_contents('php://input'), true);
    [$status, $body] = handleCreate($pdo, $input);
} else {
    $status = 404;
    $body = ["error" => "not found"];
}

http_response_code($status);
echo json_encode($body);
```

## From SQLite to MySQL — One Line

This tier's [index](/intermediate/) named MySQL as an alternative target alongside SQLite. Because every query in `store.php` and `db.php` goes through `PDO`, switching databases only ever touches `openDb`'s connection string — never the store or handler code:

```php
// SQLite (what this tier builds)
$pdo = new PDO("sqlite:{$path}");

// MySQL — same PDO API, different DSN
$pdo = new PDO("mysql:host=localhost;dbname=items", $user, $pass);
```

The `?` placeholder style used throughout `store.php` is portable across both drivers — no query changes needed. Building the MySQL-backed variant is left as follow-up work; the point of this page is that `PDO` is the abstraction that makes it a one-line change when you do.

## Checkpoint

Run with a custom path:

```bash
ITEMS_DB=/tmp/x.db php -S localhost:8000 router.php
```

In a second terminal, hit any route (e.g. `curl http://localhost:8000/items`), then stop the server with `Ctrl-C` and verify the file was created at the custom path:

```bash
ls /tmp/x.db
```

Expected:

```
/tmp/x.db
```

Run without the variable to confirm the default:

```bash
php -S localhost:8000 router.php
```

A fresh `items.db` is created in the current directory on the first request.

## Next

Continue to [08 Tests](./08-tests).
