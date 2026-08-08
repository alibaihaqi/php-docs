import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/php-docs/',
  cleanUrls: true,
  lang: 'en-US',
  lastUpdated: true,
  srcDir: 'src',
  ignoreDeadLinks: true,

  locales: {
    root: {
      label: 'English',
      lang: 'en'
    }
  },

  title: 'PHP Documentation',
  description: 'PHP Documentation Collection',

  head: [
    ['link', { rel: 'icon', href: 'https://www.alibaihaqi.com/favicon.ico' }]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Introduction', link: '/introduction/' },
      { text: 'Beginner', link: '/beginner/' },
      { text: 'Intermediate', link: '/intermediate/' },
      { text: 'Advanced', link: '/advanced/' },
      { text: 'PHP Language', link: '/php-language/' },
      { text: 'CLI Tool', link: '/cli-tool/' }
    ],

    search: {
      provider: 'local',
    },

    footer: {
      copyright: 'Copyright © 2026 - Present by Fadli Al Baihaqi'
    },

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Introduction', link: '/introduction/' },
          { text: 'Getting Started', link: '/introduction/getting-started' }
        ]
      },
      {
        text: 'Beginner',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/beginner/' },
          { text: '01 Install PHP', link: '/beginner/01-install-php' },
          { text: '02 Hello World', link: '/beginner/02-hello-world' },
          { text: '03 Variables and Types', link: '/beginner/03-variables-and-types' },
          { text: '04 Control Flow', link: '/beginner/04-control-flow' },
          { text: '05 Functions', link: '/beginner/05-functions' },
          { text: '06 Arrays', link: '/beginner/06-arrays' },
          { text: '07 Classes', link: '/beginner/07-classes' },
          { text: '08 Hello HTTP', link: '/beginner/08-hello-http' },
          { text: '09 JSON Encoding', link: '/beginner/09-json-encoding' },
          { text: '10 Serving JSON', link: '/beginner/10-serving-json' },
        ]
      },
      {
        text: 'Intermediate',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/intermediate/' },
          { text: '01 Why Persistence', link: '/intermediate/01-why-persistence' },
          { text: '02 Project Setup', link: '/intermediate/02-project-setup' },
          { text: '03 Schema', link: '/intermediate/03-schema' },
          { text: '04 Store Layer', link: '/intermediate/04-store-layer' },
          { text: '05 List and Get Handlers', link: '/intermediate/05-list-get-handlers' },
          { text: '06 Create Handler', link: '/intermediate/06-create-handler' },
          { text: '07 Config', link: '/intermediate/07-config' },
          { text: '08 Tests', link: '/intermediate/08-tests' },
        ]
      },
      {
        text: 'Advanced',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/advanced/' },
          { text: '01 Why Production Hardening', link: '/advanced/01-why-production-hardening' },
          { text: '02 JWT Auth', link: '/advanced/02-jwt-auth' },
          { text: '03 Rate Limiting', link: '/advanced/03-rate-limiting' },
          { text: '04 php-fpm and Nginx', link: '/advanced/04-php-fpm-and-nginx' },
          { text: '05 Docker', link: '/advanced/05-docker' },
          { text: '06 Integration Tests', link: '/advanced/06-integration-tests' },
          { text: '07 Config and Secrets', link: '/advanced/07-config-and-secrets' },
          { text: '08 CI/CD GitHub Actions', link: '/advanced/08-ci-cd-github-actions' },
        ]
      },
      {
        text: 'PHP Language',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/php-language/' },
          { text: '01 Why PHP', link: '/php-language/01-why-php' },
        ]
      },
      {
        text: 'CLI Tool',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/cli-tool/' },
          { text: '01 Hello CLI', link: '/cli-tool/01-hello-cli' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/alibaihaqi' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/alibaihaqi/' }
    ]
  }
})
