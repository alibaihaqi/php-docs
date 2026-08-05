---
title: 04 Control Flow
tier: beginner
platform: php
---

# 04 Control Flow

## Goal

Cover `if`/`else`, the three loop forms, and `match` — PHP 8's cleaner alternative to a `switch` chain.

## Prerequisites

- [Variables and Types](./03-variables-and-types)

## if / elseif / else

```php
<?php

$status = 404;

if ($status === 200) {
    echo "OK\n";
} elseif ($status === 404) {
    echo "Not Found\n";
} else {
    echo "Unhandled\n";
}
```

## Loops

```php
<?php

// for
for ($i = 0; $i < 3; $i++) {
    echo "for: {$i}\n";
}

// while
$i = 0;
while ($i < 3) {
    echo "while: {$i}\n";
    $i++;
}

// foreach — the one you'll use most, iterates arrays directly
foreach (["a", "b", "c"] as $letter) {
    echo "foreach: {$letter}\n";
}
```

## match (PHP 8+)

`match` is a stricter, expression-based alternative to `switch` — it uses `===` comparison (no accidental type coercion), has no fallthrough, and returns a value directly:

```php
<?php

$status = 404;

$message = match ($status) {
    200 => "OK",
    404 => "Not Found",
    500, 502, 503 => "Server Error", // multiple values, one arm
    default => "Unhandled",
};

echo $message . "\n"; // Not Found
```

Compare to `switch`, which uses `==` and falls through without an explicit `break` — a real historical footgun `match` was designed to fix.

## Checkpoint

```php
<?php

for ($i = 1; $i <= 5; $i++) {
    echo match (true) {
        $i % 15 === 0 => "FizzBuzz",
        $i % 3 === 0 => "Fizz",
        $i % 5 === 0 => "Buzz",
        default => (string) $i,
    } . "\n";
}
```

Run it — expect `1`, `2`, `Fizz`, `4`, `Buzz`.

## Next

Continue to [05 Functions](./05-functions).
