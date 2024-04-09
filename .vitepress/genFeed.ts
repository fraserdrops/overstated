import { Feed } from 'feed'
import { writeFileSync } from 'fs'
import path from 'path'
import { createContentLoader, type SiteConfig } from 'vitepress'

const baseUrl = `https://overstated.dev`

export async function genFeed(config: SiteConfig) {
  const feed = new Feed({
    title: 'Overstated',
    description: 'Exploring the complexities of modern software development',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: 'https://overstated.dev/logo.svg',
    favicon: `${baseUrl}/favicon.ico`,
    copyright: 'Copyright (c) 2023-present'
  })

  const posts = await createContentLoader('posts/*.md', {
    excerpt: true,
    render: true
  }).load()
  console.log('posts', posts)
  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string)
  )

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${baseUrl}${url}`,
      link: `${baseUrl}${url}`,
      description: excerpt,
      content: html,
      date: frontmatter.date
    })
  }

  writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2())
}
