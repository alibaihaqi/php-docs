---
title: 01 Why Persistence
tier: intermediate
platform: php
---

# 01 Why Persistence

## Goal

Understand what the beginner tier's endpoint is missing and what this tier fixes. No code on this page.

## Prerequisites

- [Beginner — Serving JSON](/beginner/10-serving-json) (the tier exit artifact)

## What the Beginner Endpoint Can't Do

The beginner tier's `router.php` returns a hardcoded array:

```php
$items = [
    new Item("Widget", 9.99),
    new Item("Gadget", 19.99),
    new Item("Gizmo", 29.99),
];
```

That array exists only for the lifetime of a single request — remember from the [Introduction](/introduction/), every PHP request gets a fresh interpreter run with no state carried over. Two things make this a dead end for a real service:

1. **No writes.** There's no way to add, change, or remove an item through the API — the list is redeclared identically on every request.
2. **No memory between requests.** Even if you mutated `$items` mid-script, the next request starts from the same hardcoded array again. Nothing persists.

Every production CRUD API replaces this with a database for exactly these two reasons.

## What This Tier Adds

You'll add a SQLite file (`items.db`) via PDO — PHP's built-in database abstraction layer — and a store class that wraps it. By the end of page 08 you'll have:

- `GET /items` — reads all rows from the database
- `GET /items/{id}` — reads one row by primary key
- `POST /items` — inserts a new row and returns it

The data survives across requests because SQLite writes it to disk. Tests use an in-memory SQLite connection (`sqlite::memory:`) so they stay fast and leave no files behind.

No Composer package needed for persistence itself — `pdo_sqlite` ships as a built-in PHP extension. Composer shows up on page 08, for PHPUnit.

## Next

Continue to [02 Project Setup](./02-project-setup).
