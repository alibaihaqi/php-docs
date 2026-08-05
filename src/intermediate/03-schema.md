---
title: 03 Schema
tier: intermediate
platform: php
---

# 03 Schema

## Goal

Open a SQLite database via PDO and create the `items` table. After this page you have an `openDb` helper every later page requires.

## Prerequisites

- [Project Setup](./02-project-setup)

## How PDO Works

`PDO` (PHP Data Objects) is PHP's built-in database abstraction — one API works across SQLite, MySQL, PostgreSQL, and others, by changing only the connection string (the DSN). For SQLite, the DSN is `sqlite:<path>`.

## The Error-Reporting Footgun

By default, `PDO` does **not** throw exceptions on failure — a bad query silently returns `false` instead of raising anything, which is exactly the kind of silent-failure trap the [Introduction](/introduction/) warned about. Always set the error mode explicitly right after connecting:

```php
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
```

## The `openDb` Helper

Create `db.php`:

```php
<?php

function openDb(string $path): PDO {
    $pdo = new PDO("sqlite:{$path}");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec('CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )');

    return $pdo;
}
```

`CREATE TABLE IF NOT EXISTS` makes the table creation idempotent — safe to call on every request without erroring on the second-and-later calls.

## Checkpoint

Create a throwaway `check.php` in the same directory to verify the file gets created:

```php
<?php
require_once __DIR__ . '/db.php';

openDb('items.db');
```

Run it:

```bash
php check.php
ls items.db
```

Expected:

```
items.db
```

Delete both `check.php` and `items.db` before continuing — the router script wires `openDb` in for real on page 07.

## Next

Continue to [04 Store Layer](./04-store-layer).
