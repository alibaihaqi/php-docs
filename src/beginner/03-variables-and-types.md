---
title: 03 Variables and Types
tier: beginner
platform: php
---

# 03 Variables and Types

## Goal

Understand PHP's scalar types, variable syntax, and how type coercion works — the thing that trips up developers coming from stricter languages most often.

## Prerequisites

- [Hello World](./02-hello-world)

## Variables

Every variable starts with `$`. No declaration keyword, no type annotation required:

```php
<?php

$name = "Mei";
$age = 29;
$price = 9.99;
$active = true;
```

## Scalar Types

| Type | Example | Notes |
|------|---------|-------|
| `string` | `"hello"` or `'hello'` | double quotes interpolate `$variables`, single quotes don't |
| `int` | `42` | platform-dependent size, typically 64-bit |
| `float` | `9.99` | also called `double` |
| `bool` | `true` / `false` | |
| `null` | `null` | absence of a value |

## Type Coercion — Read This Twice

PHP is **dynamically typed** and, by default, **loosely typed**: an `int` and a numeric `string` can compare equal with `==`.

```php
<?php

var_dump(0 == "abc");   // false as of PHP 8 (was true pre-8 — a real historical footgun)
var_dump("1" == "01");  // true  — both parse to the number 1
var_dump("10" == "1e1"); // true — both parse to the number 10
var_dump(100 == "1e2"); // true — both parse to the number 100
```

The `==` operator's rules changed materially in PHP 8 to make comparisons like the first one safer. Where it matters, use `===` (identical — same type AND same value) instead of `==` (equal — coerces first):

```php
<?php

var_dump(0 === "abc"); // false — different types, no coercion attempted
```

**Default to `===`.** Reach for `==` only when you specifically want coercion.

## Type Declarations (Optional)

Since PHP 7, you can declare types on function parameters and return values — this is what "gradual typing" means (mentioned in the [PHP Language](/php-language/) track):

```php
<?php

function greet(string $name): string {
    return "Hello, {$name}!";
}
```

More on this once functions are introduced.

## Checkpoint

```bash
php -a
```

This opens PHP's interactive shell (REPL). Try:

```php
php > var_dump("5" == "05");
bool(true)
php > var_dump("5" === "05");
bool(false)
```

Type `exit` to leave.

## Next

Continue to [04 Control Flow](./04-control-flow).
