---
title: 04 Store Layer
tier: intermediate
platform: php
---

# 04 Store Layer

## Goal

Add an `ItemStore` class that wraps `PDO` and exposes `list`, `get`, and `create`. After this page the SQL lives in one place and the HTTP-facing code (page 05 onward) never touches it directly.

## Prerequisites

- [Schema](./03-schema) — the `openDb` helper and the `items` table

## Why a Store Layer

Putting SQL inside request-handling code mixes two concerns: routing decisions (which path/method matched) and data access (`$pdo->query(...)`) end up in the same place. A store class separates them — the handler (page 05) decides *what* the caller wants, the store decides *how* to fetch it from the database.

This also makes testing easier: a test can call `$store->create("pen")` directly, with no HTTP request involved at all (see page 08).

## The `Item` and `ItemStore` Classes

Create `store.php`:

```php
<?php

class Item {
    public function __construct(
        public readonly int $id,
        public readonly string $name,
    ) {}

    public function toArray(): array {
        return ["id" => $this->id, "name" => $this->name];
    }
}

class ItemStore {
    public function __construct(private PDO $pdo) {}

    public function list(): array {
        $stmt = $this->pdo->query('SELECT id, name FROM items ORDER BY id');
        $items = [];
        foreach ($stmt as $row) {
            $items[] = new Item((int) $row['id'], $row['name']);
        }
        return $items;
    }

    public function get(int $id): ?Item {
        $stmt = $this->pdo->prepare('SELECT id, name FROM items WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        if ($row === false) {
            return null;
        }

        return new Item((int) $row['id'], $row['name']);
    }

    public function create(string $name): Item {
        $stmt = $this->pdo->prepare('INSERT INTO items (name) VALUES (?)');
        $stmt->execute([$name]);
        $id = (int) $this->pdo->lastInsertId();

        return new Item($id, $name);
    }
}
```

A few things worth noting:

- `get`/`create` use `prepare` + `execute` with a `?` placeholder — never interpolate values into the SQL string directly (e.g. `"WHERE id = {$id}"`). Placeholders are what prevent SQL injection.
- `list` uses `query` (no placeholders needed — no user input in this particular statement) and iterates the returned `PDOStatement` directly with `foreach`.
- `get` returns `?Item` — `null` when no row matched. `fetch()` returns `false` (not an exception) when there's nothing to fetch, even with `ERRMODE_EXCEPTION` set — a real row-not-found is not an error condition to PDO.
- `lastInsertId()` returns the auto-incremented primary key of the row `create` just inserted.

## Checkpoint

```bash
php -l store.php
```

`php -l` lints a file for syntax errors without running it — expect `No syntax errors detected in store.php`. The class isn't wired to anything yet; the next page connects it to HTTP.

## Next

Continue to [05 List and Get Handlers](./05-list-get-handlers).
