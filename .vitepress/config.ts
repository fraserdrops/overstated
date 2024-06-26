import { defineConfig } from 'vitepress'
import { genFeed } from './genFeed.js'

export default defineConfig({
  title: 'Overstated',
  description: 'Exploring the complexities of modern software development',
  cleanUrls: true,
  head: [
    // ['meta', { name: 'twitter:site', content: '@vuejs' }],
    // ['meta', { name: 'twitter:card', content: 'summary' }],
    // [
    //   'meta',
    //   {
    //     name: 'twitter:image',
    //     content: 'https://vuejs.org/images/logo.png'
    //   }
    // ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/logo.svg'
      }
    ]
  ],
  buildEnd: genFeed
})
