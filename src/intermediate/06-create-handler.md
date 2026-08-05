---
title: 06 Create Handler
tier: intermediate
platform: php
---

# 06 Create Handler

## Goal

Add `handleCreate` with input validation. After this page you can create items through the API and read them back with `GET /items`.

## Prerequisites

- [List and Get Handlers](./05-list-get-handlers) — the router and the `ItemStore`

## What the Handler Does

`POST /items` expects a JSON body with a `name` field. The handler:

1. Reads `name` from the already-decoded body array.
2. Rejects an empty or whitespace-only name.
3. Calls `$store->create()` to insert the row.
4. Returns the new item with status `201 Created`.

## Reading the Request Body

Unlike `$_GET`/`$_POST`, PHP has no superglobal for a raw JSON request body — `$_POST` only auto-populates for `application/x-www-form-urlencoded` or multipart bodies. Reading a JSON body is a two-step manual process: read the raw stream, then decode it.

```php
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
```

`php://input` is a read-once stream of the raw request body — this is the router script's job, not the handler's (keeping with the pattern from page 05: handlers take plain arguments, never touch superglobals or streams directly).

## The Handler

Add `handleCreate` to `handlers.php`:

```php
function handleCreate(PDO $pdo, ?array $body): array {
    $name = trim($body['name'] ?? '');

    if ($name === '') {
        return [400, ["error" => "name required"]];
    }

    $store = new ItemStore($pdo);
    $item = $store->create($name);

    return [201, $item->toArray()];
}
```

`$body['name'] ?? ''` — the null coalescing operator — handles three failure shapes in one expression: `$body` is `null` (invalid JSON), `$body` is an array without a `name` key, or `$body['name']` exists but isn't a usable value. All three fall through to the empty-name check.

## Wiring

Extend `router.php`'s dispatch to read the body and add the `POST /items` branch:

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
} elseif ($method === 'POST' && $path === '/items') {
    $input = json_decode(file_get_contents('php://input'), true);
    [$status, $body] = handleCreate($pdo, $input);
} else {
    $status = 404;
    $body = ["error" => "not found"];
}

http_response_code($status);
echo json_encode($body);
```

## Checkpoint

```bash
php -S localhost:8000 router.php
```

In a second terminal, create an item:

```bash
curl -s -i -X POST http://localhost:8000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"pen"}'
```

Expected (status 201):

```json
{"id":1,"name":"pen"}
```

List all items:

```bash
curl http://localhost:8000/items
```

Expected:

```json
[{"id":1,"name":"pen"}]
```

Test validation — send an empty name:

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8000/items \
  -H "Content-Type: application/json" \
  -d '{"name":""}'
```

Expected: `400`

Stop the server with `Ctrl-C`. Delete `items.db` before continuing so page 07's checkpoint starts from a clean file.

## Next

Continue to [07 Config](./07-config).
