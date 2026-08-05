---
title: Intermediate
tier: intermediate
platform: php
---

# Intermediate PHP Tutorials

This tier extends the Beginner tier's JSON HTTP API with a persistence layer — the API stops holding data in memory and starts reading and writing real storage.

## Where This Is Headed

- **PDO** — PHP's database abstraction layer, used instead of the older mysqli-style APIs so the same code can target SQLite during development and MySQL in production
- **SQLite** — a zero-setup file-backed database for local development
- **MySQL** — the production target once the schema and queries are proven against SQLite
- **Prepared statements** — parameterized queries from the start, not retrofitted later

The concrete page ladder (schema design, a store layer, wiring persistence into the beginner tier's endpoints) is tracked as follow-up work.

## Prerequisites

- Completed [Beginner](/beginner/) tier
- Comfortable with PHP arrays, functions, and the built-in server

Continue building once the ladder above lands.
