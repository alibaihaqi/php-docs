---
title: 05 Docker
tier: advanced
platform: php
---

# 05 Docker

## Goal

Package the API as two containers — php-fpm and nginx — that build and run together via `docker-compose`.

## Prerequisites

- [php-fpm and Nginx](./04-php-fpm-and-nginx)
- Docker installed (`docker --version`) — see the [Docker appendix](https://alibaihaqi.github.io/learning-docs/docker/01-what-is-docker.html) if you're new to Docker

## The Dockerfile

Create `Dockerfile`:

```dockerfile
# syntax=docker/dockerfile:1
FROM composer:2 AS deps
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --optimize-autoloader

FROM php:8.3-fpm-alpine
RUN apk add --no-cache sqlite-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && apk del sqlite-dev
WORKDIR /var/www/html
COPY --from=deps /app/vendor ./vendor
COPY db.php store.php handlers.php auth.php ratelimit.php router.php composer.json composer.lock ./
EXPOSE 9000
CMD ["php-fpm"]
```

Two stages: `deps` runs `composer install` in the official Composer image (keeping Composer itself out of the final image), then the runtime stage copies only the resulting `vendor/` directory across — a multistage build, the same idea as `golang`'s advanced tier uses to keep the Go toolchain out of its final image.

**`apk add sqlite-dev` before `docker-php-ext-install pdo_sqlite` is required, not optional** — `php:8.3-fpm-alpine` doesn't ship SQLite's development headers, so building the extension fails immediately with `Package 'sqlite3' not found` without this line. `apk del sqlite-dev` afterward removes the build-time-only headers from the final layer, keeping the image smaller (the compiled extension itself, `pdo_sqlite.so`, doesn't need them at runtime).

## Nginx Config as a File

Create `docker/nginx.conf` (the same config from [04 php-fpm and Nginx](./04-php-fpm-and-nginx)):

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

`fastcgi_pass php:9000` — `php` here is the *service name* from `docker-compose.yml` below, not a literal hostname. Docker Compose gives every service a DNS name matching its key, resolvable from any other service in the same compose file.

## docker-compose.yml

```yaml
services:
  php:
    build: .
    volumes:
      - items_db:/var/www/html/data
    environment:
      ITEMS_DB: /var/www/html/data/items.db
      JWT_SECRET: change-me-in-production-min-32-bytes-required

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./docker/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - php

volumes:
  items_db:
```

The `items_db` named volume persists the SQLite file across container restarts — without it, every `docker compose up` would start from an empty database, since a container's own filesystem is discarded when it stops. `JWT_SECRET` is set directly in this file for local development only — [07 Config and Secrets](./07-config-and-secrets) covers keeping real secrets out of version control.

## Checkpoint

```bash
docker compose build
docker compose up -d
```

```bash
curl http://localhost:8080/items
```

Expected:

```json
[]
```

```bash
curl -s -X POST http://localhost:8080/login -d '{"username":"alice"}'
```

Expected: a JSON object with a `token` field.

```bash
docker compose down
```

## Next

Continue to [06 Integration Tests](./06-integration-tests).
