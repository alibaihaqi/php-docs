---
title: 06 Integration Tests
tier: advanced
platform: php
---

# 06 Integration Tests

## Goal

Write a PHPUnit test that drives the API over real HTTP — starting an actual `php -S` server as a subprocess, not calling handler functions directly the way [Intermediate — Tests](/intermediate/08-tests) did.

## Prerequisites

- [Docker](./05-docker)

## Why This Is a Different Kind of Test

The intermediate tier's tests called `handleCreate($pdo, $body)` directly — fast, but it never exercises the router's dispatch logic, the rate limiter sitting in front of it, or real HTTP semantics (status codes, headers) end to end. An integration test starts the real server and talks to it over a real socket, the same way a client actually would.

## Starting a Real Server from PHPUnit

PHP has no test-server helper built in — `proc_open` starts `php -S` as a genuine subprocess, and `curl` (the extension, not the CLI) makes real HTTP requests against it:

Create `tests/IntegrationTest.php`:

```php
<?php
use PHPUnit\Framework\TestCase;

class IntegrationTest extends TestCase
{
    private static $process;
    private static string $dbPath;
    private static int $port = 8765;

    public static function setUpBeforeClass(): void
    {
        self::$dbPath = sys_get_temp_dir() . '/integration-' . uniqid() . '.db';
        $cmd = sprintf(
            'ITEMS_DB=%s JWT_SECRET=test-secret-long-enough-for-hs256-32b php -S localhost:%d %s/../router.php',
            escapeshellarg(self::$dbPath),
            self::$port,
            __DIR__
        );
        self::$process = proc_open($cmd, [], $pipes);
        usleep(500000);
    }

    public static function tearDownAfterClass(): void
    {
        proc_terminate(self::$process);
        proc_close(self::$process);
        @unlink(self::$dbPath);
    }

    private function baseUrl(): string
    {
        return 'http://localhost:' . self::$port;
    }

    public function testFullFlow(): void
    {
        $loginResponse = $this->request('POST', '/login', ['username' => 'alice']);
        $this->assertSame(200, $loginResponse['status']);
        $token = $loginResponse['body']['token'];

        $unauth = $this->request('POST', '/items', ['name' => 'pen']);
        $this->assertSame(401, $unauth['status']);

        $created = $this->request('POST', '/items', ['name' => 'pen'], $token);
        $this->assertSame(201, $created['status']);

        $list = $this->request('GET', '/items');
        $this->assertSame(200, $list['status']);
        $this->assertCount(1, $list['body']);
    }

    private function request(string $method, string $path, ?array $body = null, ?string $token = null): array
    {
        $ch = curl_init($this->baseUrl() . $path);
        $headers = ['Content-Type: application/json'];
        if ($token !== null) {
            $headers[] = "Authorization: Bearer {$token}";
        }
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
        ]);
        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }
        $raw = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        return ['status' => $status, 'body' => json_decode($raw, true)];
    }
}
```

A few details worth explaining:

- **`ITEMS_DB` points at a real temp file, not `:memory:`.** Every request `router.php` serves calls `openDb($path)` fresh — under `php -S`, each request is still a separate script execution (see the shared-nothing note in [01 Why Production Hardening](./01-why-production-hardening)). An in-memory SQLite database would be created and discarded on *every single request*, losing all data between the login call and the assertion that reads it back. A temp file persists across the whole test's requests the way `items.db` would in real use, and `tearDownAfterClass` deletes it afterward.
- **`JWT_SECRET` in the test command is 37 characters** — comfortably past the 32-byte minimum from [02 JWT Auth](./02-jwt-auth). A shorter placeholder here would 500 on the login request and fail the test with a confusing HTTP-level error instead of a clear assertion message.
- **No `curl_close($ch)` call.** As of PHP 8.0, `curl_close()` is a no-op — `CurlHandle` is a regular object PHP garbage-collects automatically — and PHP 8.5 formally deprecates calling it at all. Omit it; there's nothing to close.
- **`usleep(500000)`** gives the server half a second to finish starting before the first request — a fixed delay, simple and reliable enough for a local dev server that starts near-instantly; a flakier CI environment might need a small retry loop instead.

## PHPUnit Config

Same `phpunit.xml` from the intermediate tier — no changes needed; PHPUnit picks up any file under `tests/`.

## Checkpoint

```bash
vendor/bin/phpunit
```

Expected:

```
PHPUnit ...

.                                                                    1 / 1 (100%)

OK (1 test, 5 assertions)
```

## Next

Continue to [07 Config and Secrets](./07-config-and-secrets).
