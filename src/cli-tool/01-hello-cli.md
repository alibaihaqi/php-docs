---
title: 01 Hello CLI
tier: cli-tool
platform: php
---

# 01 Hello CLI

## Goal

Run your first PHP script from the command line, and read a command-line argument.

## Steps

### 1. Create the script

```php
<?php
// hello.php
$name = $argv[1] ?? "world";
echo "Hello, {$name}!\n";
```

`$argv` is PHP's built-in array of command-line arguments — `$argv[0]` is always the script's own path, so the first real argument is `$argv[1]`.

### 2. Run it

```bash
php hello.php
```

Expected output:

```
Hello, world!
```

### 3. Pass an argument

```bash
php hello.php PHP
```

Expected output:

```
Hello, PHP!
```

## Checkpoint

Both commands above should print the expected greeting — no web server, no built-in server flag, just `php <file>.php [args...]` directly from the shell.

## Next

More pages continue this ladder toward argument/option parsing and file persistence — tracked as follow-up work.
