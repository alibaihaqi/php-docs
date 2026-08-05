---
title: 04 php-fpm and Nginx
tier: advanced
platform: php
---

# 04 php-fpm and Nginx

## Goal

Replace `php -S` with the standard production pairing: php-fpm as the PHP process manager, nginx as the web server in front of it.

## Prerequisites

- [Rate Limiting](./03-rate-limiting)

## How the Pieces Fit Together

- **nginx** — the web server. Handles the actual TCP connections, serves anything static, and forwards `.php` requests onward.
- **php-fpm** (FastCGI Process Manager) — a pool of PHP worker processes. nginx hands each PHP request to a worker over the FastCGI protocol; the worker runs your script and hands the response back.

This is a real division of labor, not a formality: nginx is far better at handling thousands of slow/idle client connections than PHP would be, and php-fpm's worker pool means one slow request doesn't block the others — both problems `php -S`'s single-threaded model has no answer for.

## php-fpm Pool Config

php-fpm ships as part of the PHP install (`php-fpm` is a separate binary alongside `php`). Create `php-fpm.conf`:

```ini
[global]
daemonize = no

[www]
listen = 9000
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
```

`pm = dynamic` starts a small pool and grows it under load up to `pm.max_children` — a reasonable default; `pm = static` (a fixed worker count) is the alternative for predictable, capped memory usage.

## Nginx Config

Create `nginx.conf` (or a site config under `conf.d/`):

```nginx
server {
    listen 80;
    root /var/www/html;
    index router.php;

    location / {
        try_files $uri /router.php$is_args$args;
    }

    location ~ \.php$ {
        fastcgi_pass php:9000;
        fastcgi_index router.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root/router.php;
        fastcgi_param HTTP_AUTHORIZATION $http_authorization;
    }
}
```

Two things worth calling out:

- **`try_files $uri /router.php$is_args$args;`** routes every request — regardless of path — to `router.php`, the same "single entry point" shape `php -S router.php` gave you for free. Without this, nginx would 404 on any path that isn't a literal file on disk.
- **`fastcgi_param HTTP_AUTHORIZATION $http_authorization;`** is not boilerplate — it's a fix for a real, commonly-hit gap. Unlike `php -S` (confirmed in [02 JWT Auth](./02-jwt-auth) to populate `$_SERVER['HTTP_AUTHORIZATION']` automatically), nginx's standard `fastcgi_params` include does **not** forward the `Authorization` header to PHP-FPM by default in many distributions' configs. Without this line, every bearer token silently vanishes before it reaches `bearerToken()` — auth would appear completely broken with no error anywhere in the stack, since PHP just sees an absent header. This is one of the most commonly reported "why doesn't my auth header work" issues across PHP deployment guides — explicit, not incidental.

## Checkpoint

Validate the php-fpm config without starting nginx:

```bash
php-fpm -y php-fpm.conf -t
```

Expected:

```
NOTICE: configuration file php-fpm.conf test is successful
```

Full request-serving verification (nginx + php-fpm actually answering `curl`) happens in [05 Docker](./05-docker), where both run as containers together — that's the natural point to bring the whole stack up rather than installing nginx locally just for this page.

## Next

Continue to [05 Docker](./05-docker).
