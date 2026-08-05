---
title: 09 JSON Encoding
tier: beginner
platform: php
---

# 09 JSON Encoding

## Goal

Convert PHP arrays and objects to and from JSON using the built-in `json_encode`/`json_decode` functions — no library required.

## Prerequisites

- [Arrays](./06-arrays), [Classes](./07-classes)

## Encoding

`json_encode` turns a PHP value into a JSON string. An associative array becomes a JSON object; an indexed (list-style) array becomes a JSON array:

```php
<?php

$item = ["name" => "Widget", "price" => 9.99];
echo json_encode($item) . "\n";
// {"name":"Widget","price":9.99}

$list = ["Widget", "Gadget"];
echo json_encode($list) . "\n";
// ["Widget","Gadget"]
```

### Encoding Objects

`json_encode` also accepts objects directly — it serializes public properties:

```php
<?php

class Item {
    public function __construct(
        public readonly string $name,
        public readonly float $price,
    ) {}
}

$item = new Item("Widget", 9.99);
echo json_encode($item) . "\n";
// {"name":"Widget","price":9.99}
```

This works because `readonly`/`public` properties are visible to `json_encode` the same way they're visible to any other code — no `toArray()` step needed for the simple case. Reach for an explicit `toArray()` (from [07 Classes](./07-classes)) when the JSON shape needs to differ from the object's internal shape.

### Pretty-Printing

```php
<?php

echo json_encode($item, JSON_PRETTY_PRINT) . "\n";
```

```json
{
    "name": "Widget",
    "price": 9.99
}
```

## Decoding

`json_decode` turns a JSON string back into a PHP value. By default it returns `stdClass` objects; pass `true` as the second argument to get associative arrays instead — almost always what you want:

```php
<?php

$json = '{"name":"Widget","price":9.99}';

$asObject = json_decode($json);
echo $asObject->name . "\n"; // Widget

$asArray = json_decode($json, true);
echo $asArray["name"] . "\n"; // Widget
```

### Handling Invalid JSON

`json_decode` returns `null` on invalid input rather than throwing — always check:

```php
<?php

$data = json_decode("not valid json", true);

if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    echo "Invalid JSON: " . json_last_error_msg() . "\n";
}
```

## Checkpoint

```php
<?php

$items = [
    ["name" => "Widget", "price" => 9.99],
    ["name" => "Gadget", "price" => 19.99],
];

$json = json_encode($items, JSON_PRETTY_PRINT);
echo $json . "\n";

$decoded = json_decode($json, true);
echo count($decoded) . "\n"; // 2
echo $decoded[0]["name"] . "\n"; // Widget
```

## Next

Continue to [10 Serving JSON](./10-serving-json).
