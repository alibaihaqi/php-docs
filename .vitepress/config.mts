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
      copyright: 'Copyright © 2023 - Present by Fadli Al Baihaqi'
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
        ]
      },
      {
        text: 'Advanced',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/advanced/' },
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
