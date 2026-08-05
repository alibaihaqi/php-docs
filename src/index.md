---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "PHP Documentation"
  tagline: Part of the Learning Docs hub.
  actions:
    - theme: brand
      text: Introduction
      link: /introduction/
    - theme: alt
      text: Getting Started
      link: /introduction/getting-started
    - theme: alt
      text: Hub
      link: https://alibaihaqi.github.io/learning-docs/

features:
  - title: Introduction
    details: What PHP is, where it fits, and how the two build-along tracks relate.
    link: /introduction/
  - title: Beginner tier
    details: Ladder toward a small JSON HTTP API on PHP's built-in server — install, variables, control flow, functions, and your first endpoint.
    link: /beginner/
  - title: Intermediate tier
    details: Extend the API with a persistence layer — PDO, SQLite or MySQL.
    link: /intermediate/
  - title: Advanced tier
    details: Deployment hardening for the same artifact — php-fpm/nginx, Docker, CI.
    link: /advanced/
  - title: PHP Language
    details: A fundamentals deep-dive independent of the artifact ladder — types, OOP, error handling, the standard library.
    link: /php-language/
  - title: CLI Tool
    details: A second build-along artifact — a small command-line PHP tool with no framework.
    link: /cli-tool/
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #777bb4 30%, #4f5b93);
  --vp-home-hero-name-background-image: linear-gradient(-45deg, #777bb4 50%, #4f5b93 50%);
}
</style>
