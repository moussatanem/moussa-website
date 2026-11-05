import { postCommits, type Commit } from 'virtual:git'
import { findTopic, type Topic } from '../data/site'
import { parseFrontmatter, renderMarkdown, type Rendered } from './markdown'

export type Maturity = 'solid' | 'in-progress' | 'draft'

export type Post = {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  topic?: Topic
  subtopic?: string
  maturity: Maturity
  lang: string
  translation?: string
  tags: string[]
  raw: string
  body: string
  words: number
  commit?: Commit
}

const files = import.meta.glob('/content/posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const assets = import.meta.glob('/content/posts/**/*.{png,jpg,jpeg,gif,svg,webp,avif}', { query: '?url', import: 'default', eager: true }) as Record<string, string>

const MATURITY: Record<string, Maturity> = { solid: 'solid', 'in-progress': 'in-progress', 'in progress': 'in-progress', progress: 'in-progress', draft: 'draft' }
const iso = (v: unknown) => (v ? String(v).slice(0, 10) : undefined)

function load(path: string, raw: string): Post | null {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  if (slug.startsWith('_')) return null
  const { data, body } = parseFrontmatter(raw)
  if (data.hidden === true) return null
  const title = String(data.title ?? slug)
  return {
    slug,
    title,
    description: String(data.description ?? ''),
    date: iso(data.date) ?? '1970-01-01',
    updated: iso(data.updated),
    topic: findTopic(data.topic as string | undefined),
    subtopic: data.subtopic ? String(data.subtopic) : undefined,
    maturity: MATURITY[String(data.maturity ?? 'solid').toLowerCase()] ?? 'solid',
    lang: String(data.lang ?? 'en'),
    translation: data.translation ? String(data.translation) : undefined,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    raw,
    body,
    words: body.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length,
    commit: postCommits[slug],
  }
}

/** All posts, newest first. */
export const posts: Post[] = Object.entries(files)
  .map(([p, raw]) => load(p, raw))
  .filter((p): p is Post => !!p)
  .sort((a, b) => b.date.localeCompare(a.date))

export const getPost = (slug: string) => posts.find((p) => p.slug === slug)

const cache = new Map<string, Rendered>()
export function render(post: Post): Rendered {
  let r = cache.get(post.slug)
  if (!r) {
    r = renderMarkdown(post.body, {
      lang: post.lang,
      resolveAsset: (src) => {
        if (/^(https?:)?\/\//.test(src) || src.startsWith('/')) return src
        const key = '/content/posts/' + src.replace(/^\.\//, '')
        return assets[key] ?? src
      },
    })
    cache.set(post.slug, r)
  }
  return r
}

export const postsInTopic = (slug: string) => posts.filter((p) => p.topic?.slug === slug)
