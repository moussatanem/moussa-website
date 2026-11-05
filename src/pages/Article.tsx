import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { Dot, PostRow } from '../components/bits'
import { site, topics } from '../data/site'
import { useApp } from '../lib/app'
import { hubGroups, useTitle } from '../lib/hub'
import { fmtDate, L, T, type Lang } from '../lib/i18n'
import { getPost, posts, render, type Post } from '../lib/posts'
import { Link } from '../components/Link'

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' })
}

function neighbours(post: Post) {
  const pool = (post.topic ? posts.filter((p) => p.topic?.slug === post.topic?.slug) : posts).filter((p) => p.lang === post.lang)
  const i = pool.findIndex((p) => p.slug === post.slug)
  // posts are newest first: "previous" is older, "next" is newer
  const prev = pool[i + 1]
  const next = i > 0 ? pool[i - 1] : undefined
  const skip = new Set([post.slug, prev?.slug, next?.slug, post.translation])
  const related = [...pool, ...posts].filter((p, j, a) => !skip.has(p.slug) && a.indexOf(p) === j).slice(0, 3)
  return { prev, next, related }
}

function Tree({ post }: { post: Post }) {
  const { t, lang } = useApp()
  const groups = post.topic ? hubGroups(post.topic, t.other, lang) : []
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, g.items.some((i) => i.to === `/writing/${post.slug}`)])),
  )
  return (
    <aside className="tree" data-noprint>
      <div className="label">{t.topics}</div>
      {post.topic && (
        <>
          <Link to={`/topics/${post.topic.slug}`} className="current" style={{ display: 'block', textDecoration: 'none' }}>
            {L(post.topic.name, lang)}
          </Link>
          <div className="branch">
            {groups.map((g) => (
              <div key={g.id}>
                <button type="button" className="group-btn" onClick={() => setOpen((o) => ({ ...o, [g.id]: !o[g.id] }))}>
                  <span>{g.name}</span>
                  <span className="caret">{open[g.id] ? '−' : '+'}</span>
                </button>
                {open[g.id] && (
                  <div className="items">
                    {g.items.map((r) => (
                      <Link key={r.key} to={r.to} className={'leaf' + (r.to === `/writing/${post.slug}` ? ' active' : '')}>
                        {r.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <div className="others">
        {topics
          .filter((tp) => tp.slug !== post.topic?.slug)
          .map((tp) => (
            <Link key={tp.slug} to={`/topics/${tp.slug}`}>
              <span>{L(tp.name, lang)}</span>
              <span className="caret">›</span>
            </Link>
          ))}
      </div>
    </aside>
  )
}

export function Article({ slug }: { slug: string }) {
  const { t, lang } = useApp()
  const post = getPost(slug)
  useTitle(post?.title)
  const r = useMemo(() => (post ? render(post) : null), [post])
  const [active, setActive] = useState('')
  const body = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!r) return
    const onScroll = () => {
      let cur = r.toc[0]?.id ?? ''
      body.current?.querySelectorAll<HTMLElement>('[data-toc]').forEach((h) => {
        if (h.getBoundingClientRect().top < 140) cur = h.id
      })
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [r])

  if (!post || !r) return null

  const onBodyClick = (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]')
    if (!btn) return
    const code = btn.closest('.code, .cmd')?.querySelector('code')?.textContent ?? ''
    navigator.clipboard?.writeText(code).catch(() => {})
    btn.textContent = 'Copied'
    setTimeout(() => (btn.textContent = 'Copy'), 1400)
  }

  const pl = (post.lang === 'fr' ? 'fr' : 'en') as Lang
  const minutes = Math.max(1, Math.round(post.words / 220 + r.codeBlocks * 0.3))
  const facts = [`${minutes} ${t.minRead}`]
  if (r.codeBlocks) facts.push(`${r.codeBlocks} ${t.codeBlocks}`)
  if (r.incidents) facts.push(`${r.incidents} ${r.incidents > 1 ? t.incidents : t.incident}`)
  const { prev, next, related } = neighbours(post)
  const file = `${site.postsDir}/${post.slug}.md`
  const c = post.commit
  const toc = r.toc.filter((h) => h.depth === 2 || r.toc.length < 12)

  return (
    <div className="wrap-sm w-1280 article-grid">
      <Tree post={post} key={post.slug} />

      <article className="article" lang={post.lang}>
        <nav className="crumbs">
          <Link to="/">{t.nav.home}</Link>
          <span>/</span>
          {post.topic ? <Link to={`/topics/${post.topic.slug}`}>{L(post.topic.name, lang)}</Link> : <Link to="/writing">{t.nav.writing}</Link>}
          {post.subtopic && (<><span>/</span><span>{post.subtopic}</span></>)}
        </nav>
        <h1 className="h1">{post.title}</h1>
        {post.description && <p className="lede">{post.description}</p>}
        <div className="meta-bar">
          <span className="mat-badge" title={t.maturityHint[post.maturity]}>
            <Dot m={post.maturity} />
            {t.maturity[post.maturity]}
          </span>
          <span>{t.published} {fmtDate(post.date, lang)}</span>
          {post.updated && post.updated !== post.date && <span>{t.updated} {fmtDate(post.updated, lang)}</span>}
          <span>{facts.join(' · ')}</span>
          {post.topic && <Link to={`/topics/${post.topic.slug}`} className="pill">{L(post.topic.name, lang)}</Link>}
          {post.translation && getPost(post.translation) && (
            <Link to={`/writing/${post.translation}`} className="alt-lang">{T[pl].otherLang}</Link>
          )}
        </div>

        {toc.length > 0 && (
          <details className="mobile-toc">
            <summary>{t.onThisPage}</summary>
            <div>
              {toc.map((h) => (
                <button type="button" key={h.id} onClick={() => scrollToId(h.id)}>{h.label}</button>
              ))}
            </div>
          </details>
        )}

        <div ref={body} className="prose" onClick={onBodyClick} dangerouslySetInnerHTML={{ __html: r.html }} />

        <footer className="post-foot">
          {c && (
            <div className="commit">
              <div><span className="hash">commit {c.hash.slice(0, 8)}</span> (HEAD -&gt; {site.branch})</div>
              <div>Author: {c.author}</div>
              <div>Date:   {new Date(c.date).toString().slice(0, 21)}</div>
              <div className="msg">{c.subject}</div>
            </div>
          )}
          <div className="foot-links">
            <a href={`${site.repo}/edit/${site.branch}/${file}`}>{t.editOnGithub}</a>
            <a href={`${site.repo}/issues/new?title=${encodeURIComponent('Mistake in: ' + post.title)}&body=${encodeURIComponent(file)}`}>{t.reportMistake}</a>
          </div>
          {(prev || next) && (
            <div className="prevnext" data-noprint>
              {prev && (
                <Link to={`/writing/${prev.slug}`}>
                  <small>{t.previous}</small>
                  <span>{prev.title}</span>
                </Link>
              )}
              {next && (
                <Link to={`/writing/${next.slug}`} className="next">
                  <small>{t.next}</small>
                  <span>{next.title}</span>
                </Link>
              )}
            </div>
          )}
          {related.length > 0 && (
            <>
              <h3 className="related-title">{t.related}</h3>
              {related.map((p) => <PostRow key={p.slug} post={p} />)}
            </>
          )}
        </footer>
      </article>

      <aside className="toc" data-noprint>
        {toc.length > 0 && (
          <>
            <div className="label">{t.onThisPage}</div>
            <div className="rail">
              {toc.map((h) => (
                <button
                  type="button"
                  key={h.id}
                  className={(h.depth === 3 ? 'sub ' : '') + (active === h.id ? 'active' : '')}
                  onClick={() => scrollToId(h.id)}
                >
                  {h.label}
                </button>
              ))}
            </div>
            <button type="button" className="top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {t.backToTop}
            </button>
          </>
        )}
      </aside>
    </div>
  )
}
