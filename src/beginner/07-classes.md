---
title: 07 Classes
tier: beginner
platform: php
---

# 07 Classes

## Goal

Define a class with typed properties and a constructor — enough OOP to model a resource (the shape the JSON API will serve) without the full [PHP Language](/php-language/) track's depth on interfaces/traits.

## Prerequisites

- [Arrays](./06-arrays)

## A Basic Class

```php
<?php

class Item {
    public function __construct(
        public string $name,
        public float $price,
    ) {}
}

$item = new Item("Widget", 9.99);
echo $item->name . "\n";  // Widget
echo $item->price . "\n"; // 9.99
```

`public string $name` inside the constructor's parameter list is **constructor property promotion** (PHP 8+) — it declares the property AND assigns it from the matching argument in one line, replacing what used to take 4 lines (property declaration + assignment) per field.

## Methods

```php
<?php

class Item {
    public function __construct(
        public string $name,
        public float $price,
    ) {}

    public function toArray(): array {
        return [
            "name" => $this->name,
            "price" => $this->price,
        ];
    }
}

$item = new Item("Widget", 9.99);
print_r($item->toArray());
```

`toArray()` is a common pattern for exactly the reason this tier needs it: converting an object into the associative-array shape that encodes to JSON.

## Readonly Properties (PHP 8.1+)

For data that shouldn't change after construction — a good fit for API resources:

```php
<?php

class Item {
    public function __construct(
        public readonly string $name,
        public readonly float $price,
    ) {}
}

$item = new Item("Widget", 9.99);
// $item->price = 4.99; // Error: Cannot modify readonly property Item::$price
```

## Checkpoint

```php
<?php

class Item {
    public function __construct(
        public readonly string $name,
        public readonly float $price,
    ) {}

    public function toArray(): array {
        return ["name" => $this->name, "price" => $this->price];
    }
}

$items = [
    new Item("Widget", 9.99),
    new Item("Gadget", 19.99),
];

$asArrays = array_map(fn(Item $item) => $item->toArray(), $items);
print_r($asArrays);
```

Expected output:

```
Array
(
    [0] => Array
        (
            [name] => Widget
            [price] => 9.99
        )
    [1] => Array
        (
            [name] => Gadget
            [price] => 19.99
        )
)
```

## Next

Continue to [08 Hello HTTP](./08-hello-http).
