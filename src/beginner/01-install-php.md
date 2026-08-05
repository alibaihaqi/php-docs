---
title: 01 Install PHP
tier: beginner
platform: php
---

# 01 Install PHP

## Goal

Get PHP installed with the built-in web server available, so you can run and serve PHP scripts with no extra tooling.

## Steps

### macOS

```bash
brew install php
```

### Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install php-cli
```

### Windows

Download the latest non-thread-safe zip from [windows.php.net/download](https://windows.php.net/download/) and add it to your `PATH`. WSL2 with the Linux steps above is the smoother path if you have it available.

## Verify

```bash
php -v
```

Expected output (your version may differ):

```
PHP 8.3.6 (cli) (built: Apr 10 2024 09:12:12) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.3.6, Copyright (c) Zend Technologies
```

## Checkpoint

Create `hello.php`:

```php
<?php
echo "Hello, PHP!\n";
```

Run it directly with the CLI:

```bash
php hello.php
```

Expected output:

```
Hello, PHP!
```

Then start the built-in web server, which is what the rest of this tier's JSON API runs on:

```bash
php -S localhost:8000
```

Visiting `http://localhost:8000/hello.php` in a browser should print the same greeting.

## Next

Continue to [02 Hello World](./02-hello-world).
