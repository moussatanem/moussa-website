import { useMemo, useState } from 'react'
import { findTopic, notes, projects, topics } from '../data/site'
import { useApp } from '../lib/app'
import { L } from '../lib/i18n'
import { posts } from '../lib/posts'
import { navigate } from '../router'

type Item = { kind: string; title: string; meta: string; s?: string; to: string }

export function Search({ onClose }: { onClose: () => void }) {
  const { t, lang } = useApp()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)

  const index = useMemo<Item[]>(
    () => [
      ...posts.map((p) => ({ kind: 'Post', title: p.title, meta: p.topic ? L(p.topic.name, lang) : '', s: p.description + ' ' + p.tags.join(' ') + ' ' + p.body, to: `/writing/${p.slug}` })),
      ...notes.map((n) => {
        const tp = findTopic(n.topic)
        return { kind: 'Note', title: n.title, meta: tp ? L(tp.name, lang) : '', s: n.cmd, to: `/notes?topic=${n.topic}` }
      }),
      ...projects.map((p) => ({ kind: 'Project', title: p.name, meta: L(p.kind, lang), s: L(p.one, lang) + ' ' + p.stack.join(' '), to: `/projects/${p.id}` })),
      ...topics.map((tp) => ({ kind: 'Topic', title: L(tp.name, lang), meta: L(tp.blurb, lang), to: `/topics/${tp.slug}` })),
    ],
    [lang],
  )

  const query = q.trim().toLowerCase()
  const results = (
    query
      ? index.filter((r) => (r.title + ' ' + r.meta + ' ' + (r.s ?? '')).toLowerCase().includes(query))
      : index.filter((r) => r.kind !== 'Note').slice(0, 7)
  ).slice(0, 12)

  const go = (r: Item) => {
    onClose()
    navigate(r.to)
  }

  return (
    <div className="search-scrim" onClick={onClose}>
      <div className="search-box" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={t.search}>
        <div className="search-input">
          <input
            autoFocus
            value={q}
            placeholder={t.searchPlaceholder}
            onChange={(e) => {
              setQ(e.target.value)
              setSel(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
              if (e.key === 'Enter' && results[sel]) go(results[sel])
            }}
          />
          <span className="kbd">esc</span>
        </div>
        <div className="results">
          {results.map((r, i) => (
            <button type="button" key={r.kind + r.to + r.title} className={'result' + (i === sel ? ' sel' : '')} onClick={() => go(r)} onMouseEnter={() => setSel(i)}>
              <span className="kind">{r.kind}</span>
              <span className="title">{r.title}</span>
              <span className="meta">{r.meta.length > 28 ? '' : r.meta}</span>
            </button>
          ))}
          {results.length === 0 && <div className="no-results">{t.noResults}</div>}
        </div>
      </div>
    </div>
  )
}
