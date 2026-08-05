---
title: 10 Serving JSON
tier: beginner
platform: php
---

# 10 Serving JSON

## Goal

Combine everything from this tier into the artifact it's been building toward: a small JSON HTTP API served by PHP's built-in server, with no framework and no third-party dependency.

## Prerequisites

- [Hello HTTP](./08-hello-http), [JSON Encoding](./09-json-encoding)

## The API

Two routes:

- `GET /items` — returns the full item list as a JSON array
- `GET /items/{id}` — returns a single item by index, or a 404 if out of range

## Code

Create `router.php`:

```php
<?php

header('Content-Type: application/json');

class Item {
    public function __construct(
        public readonly string $name,
        public readonly float $price,
    ) {}
}

$items = [
    new Item("Widget", 9.99),
    new Item("Gadget", 19.99),
    new Item("Gizmo", 29.99),
];

$path = $_SERVER['REQUEST_URI'];

if ($path === '/items') {
    echo json_encode($items);
    exit;
}

if (preg_match('#^/items/(\d+)$#', $path, $matches)) {
    $id = (int) $matches[1];

    if (!isset($items[$id])) {
        http_response_code(404);
        echo json_encode(["error" => "item not found"]);
        exit;
    }

    echo json_encode($items[$id]);
    exit;
}

http_response_code(404);
echo json_encode(["error" => "not found"]);
```

`header('Content-Type: application/json')` sets the response header — without it, browsers and some HTTP clients treat the response as plain text instead of JSON. `preg_match` with the `#^/items/(\d+)$#` pattern extracts a numeric ID from paths like `/items/1`; `$matches[1]` holds the captured digits.

## Run It

```bash
php -S localhost:8000 router.php
```

In a second terminal:

```bash
curl http://localhost:8000/items
```

```json
[{"name":"Widget","price":9.99},{"name":"Gadget","price":19.99},{"name":"Gizmo","price":29.99}]
```

```bash
curl http://localhost:8000/items/1
```

```json
{"name":"Gadget","price":19.99}
```

```bash
curl -i http://localhost:8000/items/99
```

```
HTTP/1.1 404 Not Found
...
{"error":"item not found"}
```

Stop the server with `Ctrl-C`.

## Checkpoint

All three responses above should match. This is the artifact the [Intermediate](/intermediate/) tier picks up next — swapping the hardcoded `$items` array for real persistence (PDO, SQLite or MySQL) without changing the routing shape.

## What's Next

The Beginner tier's page ladder ends here. [Intermediate](/intermediate/) continues this same artifact with a persistence layer.
