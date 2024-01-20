import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: {
    time: number
    string: string
  }
  excerpt: string | undefined
}

declare const data: Post[]
export { data }

export default createContentLoader('src/*.md', {
  excerpt: true,
  transform(raw): Post[] {
    console.log('posts.data', raw)
    return raw
      .map(({ url, frontmatter, excerpt }) => {
        console.log('posts.data frontmatter', frontmatter, frontmatter.date)
        return {
          title: frontmatter.title,
          url,
          excerpt,
          date: formatDate(frontmatter.date)
        }
      })
      .sort((a, b) => b.date.time - a.date.time)
  }
})

function formatDate(raw: string): Post['date'] {
  const date = new Date(raw)
  date.setUTCHours(12)
  return {
    time: +date,
    string: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
