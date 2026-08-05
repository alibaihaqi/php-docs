---
title: 02 Project Setup
tier: intermediate
platform: php
---

# 02 Project Setup

## Goal

Verify the `pdo_sqlite` extension is available and create a project directory. After this page you have a folder every later page adds a file to — no package manager step needed.

## Prerequisites

- [Install PHP](/beginner/01-install-php)
- [Why Persistence](./01-why-persistence)

## Verify pdo_sqlite Is Enabled

Unlike Go's `modernc.org/sqlite` (a third-party module fetched with `go get`), PHP's SQLite driver is a **built-in extension** — no package manager step required, consistent with the "batteries included" pitch from the [Introduction](/introduction/).

```bash
php -m | grep pdo_sqlite
```

Expected output:

```
pdo_sqlite
```

If it's missing, your PHP build was compiled without it — reinstall via your platform's package manager (e.g. `brew reinstall php` on macOS bundles it by default).

## Create the Project Directory

```bash
mkdir items && cd items
```

Every file this tier adds goes here: `db.php` (page 03), `store.php` (page 04), `handlers.php` (pages 05-06), and the final `router.php` (page 07, extending the router script from [08 Hello HTTP](/beginner/08-hello-http)).

## Multiple Files: `require_once`

The beginner tier never split code across files. This tier does, so it's worth introducing `require`'s family now: it pulls in another PHP file's code at the point it's called, similar to what `import`/`go get` do in other languages — except there's no module system underneath it, just "run this other file's top-level code here."

```php
<?php
require_once __DIR__ . '/db.php';
```

`__DIR__` is a magic constant holding the current file's directory — using it instead of a relative path keeps `require_once` working regardless of what directory you run `php` from.

**Use `require_once`, not `require`, for anything declaring functions or classes.** Plain `require` re-runs the file every time it's called — harmless for a file of pure logic, but a **fatal error** ("cannot redeclare function/class") the moment two different entry points both `require` the same file in one process. This tier hits that exact case on page 08: both test files need `db.php`, and PHPUnit loads them together in a single run. `require_once` tracks which files it's already pulled in and skips the second load — the fix, and the default you should reach for.

## Checkpoint

```bash
php -m | grep pdo_sqlite
```

Should print `pdo_sqlite` with no errors. No file to check yet — this page is setup only.

## Next

Continue to [03 Schema](./03-schema).
