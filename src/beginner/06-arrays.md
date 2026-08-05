---
title: 06 Arrays
tier: beginner
platform: php
---

# 06 Arrays

## Goal

Understand PHP's single array type, which does double duty as both a list (like a slice) and a map (like a dictionary) — the data structure the rest of this tier's JSON API leans on constantly.

## Prerequisites

- [Functions](./05-functions)

## One Type, Two Shapes

Unlike languages with separate list/array and map/dictionary types, PHP has exactly one `array` type. Whether it behaves like a list or a map depends only on the keys you give it.

### Indexed (list-like)

```php
<?php

$fruits = ["apple", "banana", "cherry"];

echo $fruits[0] . "\n";     // apple
echo count($fruits) . "\n"; // 3

$fruits[] = "date"; // append
foreach ($fruits as $fruit) {
    echo $fruit . "\n";
}
```

### Associative (map-like)

```php
<?php

$user = [
    "name" => "Mei",
    "age" => 29,
];

echo $user["name"] . "\n"; // Mei
$user["email"] = "mei@example.com"; // add a key

foreach ($user as $key => $value) {
    echo "{$key}: {$value}\n";
}
```

This associative shape is exactly what the beginner tier's JSON endpoints return — a PHP associative array encodes directly to a JSON object (see [09 JSON Encoding](./09-json-encoding)).

## Common Array Functions

```php
<?php

$numbers = [1, 2, 3, 4, 5];

$doubled = array_map(fn($n) => $n * 2, $numbers);
$evens = array_filter($numbers, fn($n) => $n % 2 === 0);
$sum = array_reduce($numbers, fn($carry, $n) => $carry + $n, 0);

print_r($doubled); // [2, 4, 6, 8, 10]
print_r($evens);   // [1 => 2, 3 => 4] — note: keys are preserved, not re-indexed
echo $sum . "\n";  // 15
```

`array_filter` preserving original keys (rather than renumbering) is a common surprise — reach for `array_values(array_filter(...))` if you need a clean re-indexed list afterward.

## Checkpoint

```php
<?php

$items = [
    ["name" => "Widget", "price" => 9.99],
    ["name" => "Gadget", "price" => 19.99],
];

$names = array_map(fn($item) => $item["name"], $items);
$total = array_reduce($items, fn($carry, $item) => $carry + $item["price"], 0);

echo implode(", ", $names) . "\n"; // Widget, Gadget
echo $total . "\n";                // 29.98
```

## Next

Continue to [07 Classes](./07-classes).
