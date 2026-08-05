---
title: 02 Hello World
tier: beginner
platform: php
---

# 02 Hello World

## Goal

Write and run your first PHP script from a plain `.php` file, and understand the shape every PHP file shares.

## Prerequisites

- [Install PHP](./01-install-php)

## The Shape of a PHP File

Every PHP file follows the same rule: everything outside `<?php ... ?>` is sent to the output as-is (that's the "HTML with escape hatches" model from the [Introduction](/introduction/)); everything inside is executed as code. A pure-logic file — like every file in this tier — usually opens with `<?php` and never bothers closing it, since there's no trailing HTML to resume.

```php
<?php

echo "Hello, PHP!\n";
```

`echo` writes directly to output — no `import`, no `main` function, no entry-point boilerplate. The file itself *is* the entry point.

## Code

Create `hello.php`:

```php
<?php

echo "Hello, PHP!\n";
```

Run it:

```bash
php hello.php
```

Output:

```
Hello, PHP!
```

## Checkpoint

Change the string, save, and re-run — no build step, no compile step. Edit, run, done.

## Next

Continue to [03 Variables and Types](./03-variables-and-types).
