---
title: 08 Tests
tier: intermediate
platform: php
---

# 08 Tests

## Goal

Write store tests and handler tests using an in-memory SQLite database and PHPUnit. After this page the test suite passes and the intermediate tier is complete.

## Prerequisites

- [Config](./07-config) — the complete `router.php` and all helper files

## Composer, Finally

Every page so far avoided Composer — `pdo_sqlite` is built in, and hand-rolled `require` statements were enough for a four-file project. PHPUnit is the first genuine third-party dependency this tier needs, so this is where Composer shows up, exactly as flagged back in the [Introduction](/introduction/).

```bash
composer require --dev phpunit/phpunit
```

This creates `composer.json`, `composer.lock`, and a `vendor/` directory (PHP's equivalent of `node_modules/` — commit `composer.lock`, gitignore `vendor/`).

## Why In-Memory SQLite for Tests

Passing `:memory:` as the path to `openDb` opens a database that lives entirely in RAM and disappears when the connection closes. Tests run fast and leave no `.db` files on disk — same idea as Go's `sql.Open("sqlite", ":memory:")`.

## Store Tests

Create `tests/ItemStoreTest.php`:

```php
<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../store.php';

use PHPUnit\Framework\TestCase;

class ItemStoreTest extends TestCase
{
    private function newTestStore(): ItemStore
    {
        $pdo = openDb(':memory:');
        return new ItemStore($pdo);
    }

    public function testCreateAndGet(): void
    {
        $store = $this->newTestStore();
        $created = $store->create('pen');
        $got = $store->get($created->id);

        $this->assertSame('pen', $got->name);
    }

    public function testGetMissingReturnsNull(): void
    {
        $store = $this->newTestStore();

        $this->assertNull($store->get(999));
    }
}
```

This exercises the full round-trip through the store with no HTTP involved: create an item, read it back by ID.

## Handler Tests

Because [05 List and Get Handlers](./05-list-get-handlers) designed every handler to take plain arguments and *return* `[status, body]` instead of writing directly to output, testing them needs no fake request/response objects — call the function, check the tuple:

Create `tests/HandlersTest.php`:

```php
<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../handlers.php';

use PHPUnit\Framework\TestCase;

class HandlersTest extends TestCase
{
    public function testHandleCreateValidation(): void
    {
        $pdo = openDb(':memory:');

        $cases = [
            [['name' => 'pen'], 201],
            [['name' => ''], 400],
            [null, 400],
        ];

        foreach ($cases as [$body, $expectedStatus]) {
            [$status, ] = handleCreate($pdo, $body);
            $this->assertSame($expectedStatus, $status);
        }
    }

    public function testHandleGetNotFound(): void
    {
        $pdo = openDb(':memory:');

        [$status, ] = handleGet($pdo, '999');

        $this->assertSame(404, $status);
    }
}
```

The table has three create-validation cases: valid input (201), empty name (400), and a `null` body from malformed JSON (400) — the same three shapes [06 Create Handler](./06-create-handler)'s `$body['name'] ?? ''` was written to collapse into one check.

## PHPUnit Config

Create `phpunit.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="vendor/autoload.php">
    <testsuites>
        <testsuite name="Items">
            <directory>tests</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

`bootstrap="vendor/autoload.php"` loads Composer's autoloader before any test runs — that's what makes `use PHPUnit\Framework\TestCase;` resolve.

## Checkpoint

```bash
vendor/bin/phpunit
```

Expected:

```
PHPUnit ...

....                                                                4 / 4 (100%)

OK (4 tests, 6 assertions)
```

If `testHandleCreateValidation`'s first case (`{"name":"pen"}`) reports a non-201 status, check that `handleCreate` in `handlers.php` returns `[201, $item->toArray()]` — not `[200, ...]`.

---

## You Finished the Intermediate Tier. What's Next?

You now have a SQLite-backed CRUD API with a store layer, config, and tests — no framework. Two paths from here:

1. **Deploy it.** [Advanced](/advanced/) hardens this same artifact for real deployment.
2. **Add more endpoints.** `DELETE /items/{id}` and a full `PUT /items/{id}` update follow the same store + handler pattern from pages 04-06.
