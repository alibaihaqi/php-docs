---
title: 05 Functions
tier: beginner
platform: php
---

# 05 Functions

## Goal

Write functions with typed parameters and return types, understand default arguments, and use arrow functions for short callbacks.

## Prerequisites

- [Control Flow](./04-control-flow)

## Basic Functions

```php
<?php

function greet(string $name): string {
    return "Hello, {$name}!";
}

echo greet("Mei") . "\n";
```

The `string $name` and `: string` are optional type declarations — PHP will throw a `TypeError` at call time if you pass the wrong type, rather than silently coercing. This is the gradual-typing system mentioned in [03 Variables and Types](./03-variables-and-types).

## Default Arguments

```php
<?php

function greet(string $name, string $greeting = "Hello"): string {
    return "{$greeting}, {$name}!";
}

echo greet("Mei") . "\n";           // Hello, Mei!
echo greet("Mei", "Hi") . "\n";     // Hi, Mei!
```

## Named Arguments (PHP 8+)

```php
<?php

echo greet(name: "Mei", greeting: "Hey") . "\n"; // Hey, Mei!
echo greet(greeting: "Yo", name: "Mei") . "\n";  // order doesn't matter with named args
```

## Arrow Functions

For short, single-expression callbacks, `fn` is more compact than a full `function` and automatically captures outer variables (no `use` clause needed):

```php
<?php

$multiplier = 3;
$triple = fn(int $n): int => $n * $multiplier;

echo $triple(4) . "\n"; // 12
```

Compare to the older closure syntax, which needs an explicit `use`:

```php
<?php

$triple = function (int $n) use ($multiplier): int {
    return $n * $multiplier;
};
```

Prefer `fn` for anything that fits on one line; reach for `function ... use (...)` when the body needs multiple statements.

## Checkpoint

```php
<?php

function double(int $n): int {
    return $n * 2;
}

$numbers = [1, 2, 3, 4];
$doubled = array_map(fn($n) => double($n), $numbers);

print_r($doubled);
```

Expected output:

```
Array
(
    [0] => 2
    [1] => 4
    [2] => 6
    [3] => 8
)
```

## Next

Continue to [06 Arrays](./06-arrays).
