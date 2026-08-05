# PHP Documentation

Hands-on PHP learning documentation site built with VitePress.

## Structure

- `introduction/` - Getting started with PHP
- `beginner/` - Beginner level, building a small JSON HTTP API
- `intermediate/` - Extending the API with a persistence layer
- `advanced/` - Deployment hardening for the same artifact
- `php-language/` - Deep-dive into PHP language mechanics
- `cli-tool/` - A second build-along artifact: a small command-line PHP tool

## Development

```bash
pnpm install
pnpm docs:dev
```

## Build

```bash
pnpm docs:build
```

## Deploy

Automatically deployed to GitHub Pages on push to main.
