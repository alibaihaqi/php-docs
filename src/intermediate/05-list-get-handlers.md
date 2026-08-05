---
title: 05 List and Get Handlers
tier: intermediate
platform: php
---

# 05 List and Get Handlers

## Goal

Add `handleList` and `handleGet` functions that use `ItemStore` instead of a hardcoded array, and wire them into a router script. After this page the server returns items from SQLite.

## Prerequisites

- [Store Layer](./04-store-layer) — the `ItemStore` class with `list` and `get`

## A Testable Handler Shape

The beginner tier's [08 Hello HTTP](/beginner/08-hello-http) read `$_SERVER['REQUEST_URI']` directly inside the routing script. That's fine for a single file, but it makes handlers impossible to test without actually starting a server and making an HTTP request — PHP has no built-in equivalent to Go's `httptest`.

The fix: write each handler as a plain function that takes explicit arguments (never touches `$_SERVER` or superglobals itself) and **returns** `[statusCode, body]` instead of calling `http_response_code`/`echo` directly. The router script — which *does* read superglobals — becomes a thin layer that calls the right handler and applies its returned status/body. Page 08's tests call these functions directly, no server involved.

## The Handlers

Create `handlers.php`:

```php
<?php
require_once __DIR__ . '/store.php';

function handleList(PDO $pdo): array {
    $store = new ItemStore($pdo);
    $items = array_map(fn(Item $item) => $item->toArray(), $store->list());
    return [200, $items];
}

function handleGet(PDO $pdo, string $id): array {
    if (!ctype_digit($id)) {
        return [400, ["error" => "bad id"]];
    }

    $store = new ItemStore($pdo);
    $item = $store->get((int) $id);

    if ($item === null) {
        return [404, ["error" => "not found"]];
    }

    return [200, $item->toArray()];
}
```

`ctype_digit($id)` checks that `$id` is composed entirely of digit characters — the router will already have matched `\d+` via regex (see below), but the handler re-validates independently, since it might be called directly (as page 08's tests do) without going through the router's regex at all.

## Wiring: Extend the Router

Update `router.php` (starting from the beginner tier's `router.php`, but reading from SQLite now instead of a hardcoded array):

```php
<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/handlers.php';

header('Content-Type: application/json');

$pdo = openDb('items.db');
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && $path === '/items') {
    [$status, $body] = handleList($pdo);
} elseif ($method === 'GET' && preg_match('#^/items/(\d+)$#', $path, $matches)) {
    [$status, $body] = handleGet($pdo, $matches[1]);
} else {
    $status = 404;
    $body = ["error" => "not found"];
}

http_response_code($status);
echo json_encode($body);
```

`parse_url(..., PHP_URL_PATH)` strips any query string from `REQUEST_URI` before matching — the beginner tier's router compared the raw URI directly, which would have broken on a request like `/items?limit=10`.

## Checkpoint

```bash
php -S localhost:8000 router.php
```

In a second terminal:

```bash
curl http://localhost:8000/items
```

Expected (empty database, so an empty array):

```json
[]
```

```bash
curl -i http://localhost:8000/items/1
```

Expected: `HTTP/1.1 404 Not Found` and `{"error":"not found"}`.

Stop the server with `Ctrl-C`.

## Next

Continue to [06 Create Handler](./06-create-handler).
