import { Fragment } from 'react'
import { Dot, Empty, PostRow } from '../components/bits'
import { findTopic, now, projects, site, topics } from '../data/site'
import { useApp } from '../lib/app'
import { fmtDate, L } from '../lib/i18n'
import { hubGroups, topicCount, useTitle } from '../lib/hub'
import { posts } from '../lib/posts'
import { Link } from '../components/Link'

export function Home() {
  const { t, lang } = useApp()
  useTitle()
  return (
    <main className="wrap w-820">
      <section>
        <h1 className="h1" style={{ lineHeight: 1.08 }}>{site.name}</h1>
        <p className="lede" style={{ marginTop: 16, maxWidth: '46ch' }}>{t.tagline}</p>
        <div className="contact">
          <span className="muted">{site.location}</span>
          {site.github && <a href={site.github}>GitHub</a>}
          {site.linkedin && <a href={site.linkedin}>LinkedIn</a>}
          {site.email && <a href={'mailto:' + site.email}>Email</a>}
          {site.cv && <a href={site.cv} className="cv">CV (PDF)</a>}
        </div>
      </section>

      <section className="card now">
        <div className="spread" style={{ flexWrap: 'wrap', gap: 12 }}>
          <h2 className="h2" style={{ fontSize: 22 }}>{t.now}</h2>
          <span className="mono muted" style={{ fontSize: 12 }}>{t.updated} {fmtDate(site.nowUpdated, lang)}</span>
        </div>
        <div style={{ marginTop: 10 }}>
          {now.map((it) => (
            <div className="now-row" key={it.k.en}>
              <span className="k">{L(it.k, lang)}</span>
              <span className="v">{L(it.v, lang)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head">
          <h2 className="h2">{t.projects}</h2>
          <Link to="/projects" className="more">{t.allProjects}</Link>
        </div>
        <div className="grid-projects">
          {projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`} className="card proj-card">
              <div className="spread" style={{ gap: 12 }}>
                <span className="name">{p.name}</span>
                <span className="mono muted" style={{ fontSize: 11.5, whiteSpace: 'nowrap' }}>{L(p.period, lang)}</span>
              </div>
              <span className="one">{L(p.one, lang)}</span>
              <div className="pills" style={{ marginTop: 'auto', paddingTop: 4 }}>
                {p.stack.slice(0, 4).map((s) => <span className="pill" key={s}>{s}</span>)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head" style={{ marginBottom: 8 }}>
          <h2 className="h2">{t.latest}</h2>
          <Link to="/writing" className="more">{t.allWriting}</Link>
        </div>
        {posts.slice(0, 6).map((p) => <PostRow key={p.slug} post={p} />)}
        {posts.length === 0 && <Empty />}
      </section>

      <section className="sec">
        <h2 className="h2" style={{ marginBottom: 18 }}>{t.topics}</h2>
        <div className="grid-topics">
          {topics.map((tp) => (
            <Link key={tp.slug} to={`/topics/${tp.slug}`} className="topic-tile">
              <span className="spread">
                <span className="name">{L(tp.name, lang)}</span>
                <span className="mono muted" style={{ fontSize: 12 }}>{topicCount(tp.slug)}</span>
              </span>
              <span className="blurb">{L(tp.blurb, lang)}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export function Writing() {
  const { t } = useApp()
  useTitle(t.nav.writing)
  const years = [...new Set(posts.map((p) => p.date.slice(0, 4)))]
  const [a, notesWord, b, topicWord, c] = t.writingIntro
  return (
    <main className="wrap w-820">
      <h1 className="h1">{t.nav.writing}</h1>
      <p className="intro">
        {a}<Link to="/notes">{notesWord}</Link>{b}<Link to="/topics">{topicWord}</Link>{c}
      </p>
      {years.map((y) => (
        <section key={y} style={{ marginTop: 44 }}>
          <h2 className="mono muted" style={{ fontWeight: 500, fontSize: 13, margin: '0 0 4px', letterSpacing: '0.04em' }}>{y}</h2>
          {posts.filter((p) => p.date.startsWith(y)).map((p) => <PostRow key={p.slug} post={p} short showMat />)}
        </section>
      ))}
      {posts.length === 0 && <div style={{ marginTop: 44 }}><Empty /></div>}
    </main>
  )
}

export function Topics() {
  const { t, lang } = useApp()
  useTitle(t.topics)
  return (
    <main className="wrap w-1040">
      <h1 className="h1">{t.topics}</h1>
      <p className="intro">{t.topicsIntro}</p>
      <div className="grid-topics-lg">
        {topics.map((tp) => (
          <Link key={tp.slug} to={`/topics/${tp.slug}`} className="card topic-card">
            <span className="spread">
              <span className="name">{L(tp.name, lang)}</span>
              <span className="mono muted" style={{ fontSize: 12 }}>{topicCount(tp.slug)} {t.entries}</span>
            </span>
            <span className="blurb">{L(tp.blurb, lang)}</span>
            <span className="subs">{tp.subtopics.map((s) => L(s.name, lang)).join(' · ')}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}

export function TopicHub({ slug }: { slug: string }) {
  const { t, lang } = useApp()
  const topic = findTopic(slug)
  useTitle(topic ? L(topic.name, lang) : undefined)
  if (!topic) return null
  const groups = hubGroups(topic, t.other, lang)
  const all = groups.flatMap((g) => g.items)
  const nPosts = all.filter((i) => i.type === 'Post').length
  const latest = all.reduce((m, i) => (i.date > m ? i.date : m), '')
  return (
    <main className="wrap-sm w-1100 hub">
      <div style={{ minWidth: 0 }}>
        <nav className="crumbs">
          <Link to="/">{t.nav.home}</Link><span>/</span><Link to="/topics">{t.topics}</Link><span>/</span><span className="here">{L(topic.name, lang)}</span>
        </nav>
        <h1 className="h1" style={{ marginTop: 18 }}>{L(topic.name, lang)}</h1>
        <p className="lede" style={{ fontSize: 17, lineHeight: 1.65, marginTop: 16, maxWidth: '62ch' }}>{L(topic.intro, lang)}</p>
        <div className="hub-meta">
          <span>{nPosts} {t.posts}</span>
          <span>{all.length - nPosts} {t.notesWord}</span>
          {latest && <span>{t.updated} {fmtDate(latest, lang)}</span>}
        </div>
        {groups.map((g) => (
          <section key={g.id} id={g.id} className="hub-group">
            <h2>{g.name}</h2>
            {g.desc && <p className="desc">{g.desc}</p>}
            {g.items.map((r) => (
              <Link key={r.key} to={r.to} className="hub-row">
                <Dot m={r.maturity} title={t.maturity[r.maturity]} />
                <span className="title">{r.title}</span>
                <span className="type">{r.type}</span>
                <span className="date">{fmtDate(r.date, lang)}</span>
              </Link>
            ))}
          </section>
        ))}
        {groups.length === 0 && <div style={{ marginTop: 48 }}><Empty /></div>}
      </div>
      <aside className="side">
        <div className="label">{t.subtopics}</div>
        {groups.map((g) => (
          <a key={g.id} href={'#' + g.id} className="side-link" onClick={(e) => { e.preventDefault(); document.getElementById(g.id)?.scrollIntoView({ behavior: 'smooth' }) }}>
            <span>{g.name}</span>
            <span className="mono muted" style={{ fontSize: 12 }}>{g.items.length}</span>
          </a>
        ))}
        <div className="legend">
          {(['draft', 'in-progress', 'solid'] as const).map((m) => (
            <Fragment key={m}><span><Dot m={m} />{t.maturity[m]}</span></Fragment>
          ))}
        </div>
      </aside>
    </main>
  )
}
