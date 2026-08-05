---
title: 08 Hello HTTP
tier: beginner
platform: php
---

# 08 Hello HTTP

## Goal

Run a PHP script that serves the text `hello` at `http://localhost:8000/hello`, using only the built-in server — no framework, no third-party router.

## Prerequisites

- [Functions](./05-functions)

## Two Ways PHP's Built-in Server Handles Requests

1. **Direct file mapping** (what [01 Install PHP](./01-install-php)'s checkpoint used): a request to `/hello.php` runs `hello.php` directly. Fine for one-off scripts, but every route needs its own file.
2. **Router script**: pass a single PHP file to `php -S`, and *every* request — regardless of path — runs through that file first. The script inspects `$_SERVER['REQUEST_URI']` and decides what to do. This is how the rest of this tier's JSON API will route requests.

## What a Router Script Looks Like

`$_SERVER` is a superglobal — an associative array PHP populates automatically with request metadata, always available, no import needed. `$_SERVER['REQUEST_URI']` holds the requested path (e.g. `/hello`).

## Code

Create `router.php`:

```php
<?php

$path = $_SERVER['REQUEST_URI'];

if ($path === '/hello') {
    echo "hello\n";
} else {
    http_response_code(404);
    echo "not found\n";
}
```

Run it:

```bash
php -S localhost:8000 router.php
```

You should see:

```
[Sat Jan  1 00:00:00 2026] PHP 8.3.6 Development Server (http://localhost:8000) started
```

In a second terminal:

```bash
curl http://localhost:8000/hello
```

Output:

```
hello
```

Try an unmapped path:

```bash
curl -i http://localhost:8000/nope
```

You should see `HTTP/1.1 404 Not Found` in the headers, followed by `not found`.

Stop the server with `Ctrl-C`.

`http_response_code(404)` sets the HTTP status code for the response — the router script controls both the routing decision and the status, exactly the two things a framework's routing layer would otherwise handle for you.

## Checkpoint

Extend `router.php` with a second route (`/status`) that returns a different message, and confirm both `/hello` and `/status` respond correctly while everything else still 404s.

## Next

Continue to [09 JSON Encoding](./09-json-encoding).
