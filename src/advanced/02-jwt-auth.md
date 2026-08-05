---
title: 02 JWT Auth
tier: advanced
platform: php
---

# 02 JWT Auth

## Goal

Add a `/login` endpoint that issues a JWT, and require a valid bearer token on `POST /items`.

## Prerequisites

- [Why Production Hardening](./01-why-production-hardening)
- [Intermediate — Tests](/intermediate/08-tests) — Composer already introduced there

## Add the JWT Library

Signing and verifying JWTs correctly (constant-time signature comparison, algorithm confusion prevention) is exactly the kind of code not worth hand-rolling. `firebase/php-jwt` is the de facto standard:

```bash
composer require firebase/php-jwt
```

## The Auth Helpers

Create `auth.php`:

```php
<?php
require_once __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function jwtSecret(): string {
    return getenv('JWT_SECRET') ?: 'dev-secret-do-not-use-in-production';
}

function issueToken(string $username): string {
    $payload = [
        'sub' => $username,
        'exp' => time() + 3600,
    ];
    return JWT::encode($payload, jwtSecret(), 'HS256');
}

function verifyToken(string $token): ?array {
    try {
        $decoded = JWT::decode($token, new Key(jwtSecret(), 'HS256'));
        return (array) $decoded;
    } catch (\Throwable $e) {
        return null;
    }
}

function bearerToken(): ?string {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($header, 'Bearer ')) {
        return null;
    }
    return substr($header, 7);
}
```

**`JWT_SECRET` must be at least 32 bytes.** `firebase/php-jwt` enforces a minimum HMAC key length for HS256 — 256 bits, i.e. 32 ASCII characters — and throws a `DomainException` (uncaught, so it surfaces as an unhandled 500) if the secret is shorter. This isn't a library quirk to route around; it's the library correctly refusing a secret weak enough to be brute-forced. `'dev-secret-do-not-use-in-production'` above is 35 characters — comfortably over the line — but a shorter placeholder like `'change-me'` would 500 on the very first login. When you set a real `JWT_SECRET`, generate one long enough: `openssl rand -base64 32`.

`JWT::decode` throws on any failure — expired token, wrong signature, malformed structure — rather than returning a sentinel value. `verifyToken` catches broadly (`\Throwable`, not a specific exception type) because the library throws several distinct exception classes for different failure modes, and this tier treats all of them identically: `null`, meaning "not authenticated." `bearerToken()` reads `$_SERVER['HTTP_AUTHORIZATION']` — confirmed live to be populated correctly by `php -S` without any special configuration; nginx needs one explicit line to do the same (see [04 php-fpm and Nginx](./04-php-fpm-and-nginx)).

## The Login Handler

Add `handleLogin` to `handlers.php`:

```php
function handleLogin(?array $body): array {
    $username = trim($body['username'] ?? '');

    if ($username === '') {
        return [400, ["error" => "username required"]];
    }

    return [200, ["token" => issueToken($username)]];
}
```

This tier doesn't verify a password — a real system would check `$username` against stored (hashed) credentials before issuing a token. Issuing a token for any non-empty username is enough to demonstrate the auth *mechanism*; wiring in real credential storage is flagged as follow-up work.

## Wiring

Extend `router.php`: add the `/login` route, and require a valid token before reaching `handleCreate`:

```php
if ($method === 'POST' && $requestPath === '/login') {
    $input = json_decode(file_get_contents('php://input'), true);
    [$status, $body] = handleLogin($input);
} elseif ($method === 'GET' && $requestPath === '/items') {
    [$status, $body] = handleList($pdo);
} elseif ($method === 'GET' && preg_match('#^/items/(\d+)$#', $requestPath, $matches)) {
    [$status, $body] = handleGet($pdo, $matches[1]);
} elseif ($method === 'POST' && $requestPath === '/items') {
    $claims = verifyToken(bearerToken() ?? '');
    if ($claims === null) {
        http_response_code(401);
        echo json_encode(["error" => "unauthorized"]);
        exit;
    }
    $input = json_decode(file_get_contents('php://input'), true);
    [$status, $body] = handleCreate($pdo, $input);
} else {
    $status = 404;
    $body = ["error" => "not found"];
}
```

`GET /items` and `GET /items/{id}` stay unauthenticated — only writes are protected, a deliberate scope choice for this tier, not an oversight.

## Checkpoint

```bash
php -S localhost:8000 router.php
```

In a second terminal, without a token:

```bash
curl -i -X POST http://localhost:8000/items -d '{"name":"laptop"}'
```

Expected: `HTTP/1.1 401 Unauthorized`

Log in:

```bash
curl -s -X POST http://localhost:8000/login -d '{"username":"alice"}'
```

Expected:

```json
{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...."}
```

With the token:

```bash
TOKEN='<paste the token value>'
curl -i -X POST http://localhost:8000/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"laptop"}'
```

Expected: `HTTP/1.1 201 Created` and `{"id":1,"name":"laptop"}`

Stop the server with `Ctrl-C`.

## Next

Continue to [03 Rate Limiting](./03-rate-limiting).
