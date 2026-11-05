import { useEffect } from 'react'
import { notes, site, type Topic } from '../data/site'
import { L, type Lang } from './i18n'
import { postsInTopic } from './posts'

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${site.name}` : site.name
  }, [title])
}

export const topicCount = (slug: string) => postsInTopic(slug).length + notes.filter((n) => n.topic === slug).length

export type HubItem = { key: string; title: string; type: 'Post' | 'Note'; date: string; to: string; maturity: 'solid' | 'in-progress' | 'draft' }
export type HubGroup = { id: string; name: string; desc: string; items: HubItem[] }

/** Groups a topic's posts and notes by subtopic, in the order the topic defines. */
export function hubGroups(topic: Topic, otherLabel: string, lang: Lang): HubGroup[] {
  const items: (HubItem & { sub?: string })[] = [
    ...postsInTopic(topic.slug).map((p) => ({ key: 'p' + p.slug, title: p.title, type: 'Post' as const, date: p.date, to: `/writing/${p.slug}`, maturity: p.maturity, sub: p.subtopic })),
    ...notes.filter((n) => n.topic === topic.slug).map((n) => ({ key: 'n' + n.date + n.title, title: n.title, type: 'Note' as const, date: n.date, to: `/notes?topic=${topic.slug}`, maturity: 'solid' as const, sub: n.subtopic })),
  ].sort((a, b) => b.date.localeCompare(a.date))
  // Match posts/notes against the English subtopic name (frontmatter stays EN).
  const known = new Set(topic.subtopics.map((s) => s.name.en.toLowerCase()))
  const groups: HubGroup[] = topic.subtopics.map((s) => ({
    id: topic.slug + '-' + s.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: L(s.name, lang),
    desc: L(s.desc, lang),
    items: items.filter((i) => i.sub?.toLowerCase() === s.name.en.toLowerCase()),
  }))
  const rest = items.filter((i) => !i.sub || !known.has(i.sub.toLowerCase()))
  if (rest.length) groups.push({ id: topic.slug + '-other', name: otherLabel, desc: '', items: rest })
  return groups.filter((g) => g.items.length)
}

