---
title: 01 Why PHP
tier: php-language
platform: php
---

# 01 Why PHP

## Goal

Understand what problem PHP was built to solve, where it fits today, and its real tradeoffs.

## The Original Problem

PHP started as a set of tools for generating dynamic web pages — the core model is still visible today: a PHP file is HTML with escape hatches into code (`<?php ... ?>`), and the runtime is designed around a request/response lifecycle rather than a long-running process. Every request gets a fresh interpreter run; there's no shared in-process state to reason about between requests unless you explicitly reach for one (Redis, a database, etc.).

## What You Get

| Property | Why it matters |
|----------|-----------------|
| Shared-nothing request model | No stale in-memory state between requests; a crashed request doesn't take the process down |
| No build step | Edit a file, refresh the browser — no compile/bundle step |
| Huge standard library | HTTP, files, dates, regex, and more available with zero dependencies |
| Composer + PSR standards | A real package ecosystem with interop conventions across frameworks |
| Massive hosting footprint | Cheap, ubiquitous hosting; near-universal support |

## Where PHP Shines

- **Web backends** — the language's native habitat; the built-in server and shared-nothing model map directly onto HTTP request handling
- **CMS ecosystems** — WordPress alone accounts for a large share of all websites, all of it PHP; Laravel and Symfony cover the framework end
- **Rapid iteration** — no compile step means a very short edit-refresh loop
- **Scripting and CLI tools** — the same runtime that serves web requests runs standalone scripts (see the [CLI Tool](/cli-tool/) track on this site)

## Where PHP Is a Weaker Fit

- **Long-running processes** — the shared-nothing model that helps web requests works against you for daemons/workers; those exist (Swoole, RoadRunner) but are the exception, not the default
- **CPU-bound numeric work** — no first-class numeric/array-computation ecosystem comparable to Python's or Julia's
- **Strict compile-time type guarantees** — PHP's type system (added incrementally since PHP 7) is optional and gradual, not the primary safety mechanism the way it is in Rust or Go

## Checkpoint

```php
<?php
// Shared-nothing in action: nothing here persists across requests
// unless you explicitly write it somewhere (session, cache, DB).
$counter = 0;
$counter++;
echo $counter; // always prints 1, every single request
```

Compare this to a long-running Node.js or Go process, where a global variable like `$counter` really would accumulate across requests — that's the core mental model shift PHP asks for.

## Next

Continue to more language topics (types, OOP, error handling, and beyond) as they land — tracked as follow-up work.
