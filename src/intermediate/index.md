---
title: Intermediate
tier: intermediate
platform: php
---

# Intermediate PHP Tutorials

This tier extends the Beginner tier's JSON HTTP API with a persistence layer — the API stops holding data in memory and starts reading and writing real storage.

## What You'll Build

`GET /items`, `GET /items/{id}`, and `POST /items` reading and writing an `items.db` SQLite file via PDO, a store layer separating SQL from routing, config via an environment variable, and a PHPUnit test suite. No framework.

## Learning Path

| # | Tutorial | Concepts |
|---|----------|----------|
| 01 | [Why Persistence](./01-why-persistence) | What the beginner endpoint can't do |
| 02 | [Project Setup](./02-project-setup) | `pdo_sqlite` extension, `require` |
| 03 | [Schema](./03-schema) | `PDO`, DSNs, `ERRMODE_EXCEPTION` |
| 04 | [Store Layer](./04-store-layer) | `ItemStore` class, prepared statements |
| 05 | [List and Get Handlers](./05-list-get-handlers) | Testable handler shape, `parse_url` |
| 06 | [Create Handler](./06-create-handler) | `php://input`, null coalescing validation |
| 07 | [Config](./07-config) | `getenv`, SQLite → MySQL via DSN |
| 08 | [Tests](./08-tests) | Composer, PHPUnit, in-memory SQLite |

## Prerequisites

- Completed [Beginner](/beginner/) tier
- Comfortable with PHP arrays, functions, and the built-in server

Start with [01 Why Persistence](./01-why-persistence).
