import { commits } from 'virtual:git'
import { Empty } from '../components/bits'
import { certs, education, experience, findTopic, languages, notes, projects, site, skills, topics, uses } from '../data/site'
import { useApp } from '../lib/app'
import { useTitle } from '../lib/hub'
import { fmtDate, L } from '../lib/i18n'
import { getPost } from '../lib/posts'
import { navigate, useLocation } from '../router'
import { Link } from '../components/Link'

export function Projects() {
  const { t, lang } = useApp()
  useTitle(t.nav.projects)
  return (
    <main className="wrap w-880">
      <h1 className="h1">{t.nav.projects}</h1>
      <p className="intro">{t.projectsIntro}</p>
      {projects.map((p) => (
        <section key={p.id} className="card proj-sec">
          <div className="spread" style={{ flexWrap: 'wrap', gap: '6px 16px' }}>
            <Link to={`/projects/${p.id}`} className="name">{p.name}</Link>
            <span className="mono muted" style={{ fontSize: 12 }}>{L(p.kind, lang)} · {L(p.period, lang)}</span>
          </div>
          <p className="one">{L(p.one, lang)}</p>
          <div className="two-col">
            <div><div className="label">{t.problem}</div>{L(p.problem, lang)}</div>
            <div><div className="label">{t.whatIBuilt}</div>{L(p.builtShort, lang)}</div>
          </div>
          <div className="proj-foot">
            <div className="pills">{p.stack.map((s) => <span className="pill" key={s}>{s}</span>)}</div>
            <span className="muted" style={{ fontSize: 13.5 }}>{L(p.role, lang)}</span>
            <Link to={`/projects/${p.id}`} className="more" style={{ marginLeft: 'auto' }}>{t.details}</Link>
          </div>
        </section>
      ))}
    </main>
  )
}

export function Project({ id }: { id: string }) {
  const { t, lang } = useApp()
  const p = projects.find((x) => x.id === id)
  useTitle(p?.name)
  if (!p) return null
  const writeups = p.posts.map(getPost).filter((x) => !!x)
  return (
    <main className="wrap-sm w-760">
      <nav className="crumbs">
        <Link to="/">{t.nav.home}</Link><span>/</span><Link to="/projects">{t.nav.projects}</Link><span>/</span><span className="here">{p.name}</span>
      </nav>
      <h1 className="h1" style={{ marginTop: 18 }}>{p.name}</h1>
      <p className="lede">{L(p.one, lang)}</p>
      <dl className="facts">
        <div><dt className="label">{t.role}</dt><dd>{L(p.role, lang)}</dd></div>
        <div><dt className="label">{t.period}</dt><dd>{L(p.period, lang)}</dd></div>
        <div><dt className="label">{t.status}</dt><dd>{L(p.status, lang)}</dd></div>
        <div>
          <dt className="label">{t.code}</dt>
          <dd className="mono" style={{ fontSize: 13, wordBreak: 'break-all' }}>{p.repoUrl ? <a href={p.repoUrl}>{L(p.repo, lang)}</a> : L(p.repo, lang)}</dd>
        </div>
      </dl>
      <div className="page-body">
        <h2>{t.problem}</h2>
        <p>{L(p.problem, lang)}</p>
        <h2>{t.whatIBuilt}</h2>
        <ul>{L(p.built, lang).map((b) => <li key={b}>{b}</li>)}</ul>
        <h2>{t.stack}</h2>
        <div className="pills" style={{ gap: 8, marginTop: 14 }}>{p.stack.map((s) => <span className="stack-lg" key={s}>{s}</span>)}</div>
        {writeups.length > 0 && (
          <>
            <h2 style={{ marginBottom: 6 }}>{t.writeups}</h2>
            {writeups.map((w) => (
              <Link key={w.slug} to={`/writing/${w.slug}`} className="row" style={{ padding: '12px 0' }}>
                <span className="title">{w.title}</span>
              </Link>
            ))}
          </>
        )}
      </div>
    </main>
  )
}

export function Notes() {
  const { t, lang } = useApp()
  useTitle(t.nav.notes)
  const { query } = useLocation()
  const sel = findTopic(query.get('topic') ?? '')?.slug ?? 'all'
  const list = notes.filter((n) => sel === 'all' || n.topic === sel)
  const chips = [{ slug: 'all', name: t.all }, ...topics.filter((tp) => notes.some((n) => n.topic === tp.slug)).map((tp) => ({ slug: tp.slug, name: L(tp.name, lang) }))]
  const selName = findTopic(sel) ? L(findTopic(sel)!.name, lang) : undefined
  return (
    <main className="wrap w-880">
      <h1 className="h1">{t.nav.notes}</h1>
      <p className="intro">{t.notesIntro}</p>
      <div className="chips">
        {chips.map((c) => (
          <button
            type="button"
            key={c.slug}
            className={'chip' + (sel === c.slug ? ' on' : '')}
            onClick={() => navigate(c.slug === 'all' ? '/notes' : `/notes?topic=${c.slug}`, { replace: true, keepScroll: true })}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="count-bar">
        {list.length} {t.note}{list.length === 1 ? '' : 's'}{selName ? ` ${t.noteIn} ${selName}` : ''}
      </div>
      {list.length === 0 ? (
        <div style={{ marginTop: 28 }}><Empty /></div>
      ) : list.map((n) => (
        <div className="note" key={n.date + n.title}>
          <span className="date">{fmtDate(n.date, lang, { year: false })}</span>
          <div className="body">
            <div className="title">{n.title}</div>
            <div className="cmd-line">{n.cmd}</div>
          </div>
          <span className="pill">{(() => { const tp = findTopic(n.topic); return tp ? L(tp.name, lang) : n.topic })()}</span>
        </div>
      ))}
    </main>
  )
}

export function About() {
  const { t, lang } = useApp()
  useTitle(t.nav.about)
  return (
    <main className="wrap w-780">
      <div className="about-head">
        <div className="about-identity">
          {site.photo && (
            <img className="about-photo" src={site.photo} alt={site.name} width={112} height={112} />
          )}
          <div>
            <h1 className="h1">{site.name}</h1>
            <div style={{ fontSize: 16, color: 'var(--ink2)', marginTop: 8 }}>{L(site.role, lang)} · {site.location}</div>
          </div>
        </div>
        {site.cv && (
          <div data-noprint>
            <a className="solid-btn" href={site.cv} download>{t.downloadCv}</a>
          </div>
        )}
      </div>
      <p style={{ fontSize: 17, lineHeight: 1.7, margin: '28px 0 0', textWrap: 'pretty' }}>
        {t.aboutBio}
      </p>
      <div className="contact" style={{ marginTop: 16 }}>
        {site.github && <a href={site.github} style={{ color: 'var(--accent)' }}>GitHub</a>}
        {site.linkedin && <a href={site.linkedin} style={{ color: 'var(--accent)' }}>LinkedIn</a>}
        {site.email && <a href={'mailto:' + site.email} style={{ color: 'var(--accent)' }}>Email</a>}
      </div>

      <h2 className="cv-h2" style={{ marginTop: 52 }}>{t.experience}</h2>
      {experience.map((e) => (
        <div className="cv-row" key={e.when.en + e.role.en + e.org}>
          <span className="when">{L(e.when, lang)}</span>
          <div className="main">
            <div className="role">{L(e.role, lang)}</div>
            <div className="org">{e.org}</div>
            <p className="desc">{L(e.desc, lang)}</p>
          </div>
        </div>
      ))}

      <h2 className="cv-h2">{t.education}</h2>
      {education.map((e) => (
        <div className="cv-row" key={e.name.en}>
          <span className="when">{L(e.when, lang)}</span>
          <div className="main"><div className="role">{L(e.name, lang)}</div><div className="org">{L(e.org, lang)}</div></div>
        </div>
      ))}

      {certs.length > 0 && (
        <>
          <h2 className="cv-h2">{t.certifications}</h2>
          {certs.map((c) => (
            <div className="cv-row tight" key={c.name}>
              <span className="when" style={{ paddingTop: 0 }}>{c.when}</span>
              <span style={{ flex: '1 1 240px', fontSize: 15.5 }}>{c.name}</span>
              <span className="mat">
                <span className={'dot ' + (c.status === 'Done' ? 'solid' : c.status === 'In progress' ? 'progress' : '')} />
                {c.status}
              </span>
            </div>
          ))}
        </>
      )}

      <h2 className="cv-h2">{t.skills}</h2>
      {skills.map((s) => (
        <div className="cv-row tight" key={s.area.en}>
          <span style={{ fontSize: 14.5, fontWeight: 500, width: 120 }}>{L(s.area, lang)}</span>
          <span style={{ flex: '1 1 380px', fontSize: 15, lineHeight: 1.6, color: 'var(--ink2)' }}>{s.items}</span>
        </div>
      ))}

      <h2 className="cv-h2">{t.languages}</h2>
      {languages.map((l) => (
        <div className="cv-row tight" key={l.name.en}>
          <span style={{ fontSize: 14.5, fontWeight: 500, width: 120 }}>{L(l.name, lang)}</span>
          <span style={{ flex: '1 1 380px', fontSize: 15, lineHeight: 1.6, color: 'var(--ink2)' }}>{L(l.level, lang)}</span>
        </div>
      ))}
    </main>
  )
}

export function Uses() {
  const { t, lang } = useApp()
  useTitle('/uses')
  return (
    <main className="wrap w-780">
      <h1 className="h1">/uses</h1>
      <p className="intro">{t.usesIntro}</p>
      {uses.length === 0 ? (
        <div style={{ marginTop: 44 }}><Empty /></div>
      ) : (
        uses.map((g) => (
          <section key={g.name.en} style={{ marginTop: 44 }}>
            <h2 className="h2" style={{ fontSize: 24, marginBottom: 6 }}>{L(g.name, lang)}</h2>
            {g.items.map((i) => (
              <div className="uses-row" key={i.k.en}>
                <span className="k">{L(i.k, lang)}</span>
                <span className="v">{L(i.v, lang)}</span>
              </div>
            ))}
          </section>
        ))
      )}
    </main>
  )
}

export function Log() {
  const { t, lang } = useApp()
  useTitle('git log')
  return (
    <main className="wrap w-820">
      <h1 className="h1">git log</h1>
      <p className="intro">{t.logIntro}</p>
      <div className="mono muted" style={{ fontSize: 12, margin: '28px 0 0', paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
        $ git log --oneline --shortstat {site.branch}
      </div>
      {commits.map((c) => {
        const m = /^(\w+(?:\([^)]*\))?!?:)\s*(.*)$/.exec(c.subject)
        return (
          <div className="log-row" key={c.hash}>
            <span className="h">{c.short}</span>
            <span className="m">{m ? <><span className="t">{m[1]}</span> {m[2]}</> : c.subject}</span>
            <span className="add">+{c.add}</span>
            <span className="del">−{c.del}</span>
            <span className="d">{fmtDate(c.date.slice(0, 10), lang, { year: false })}</span>
          </div>
        )
      })}
      <div className="mono muted" style={{ fontSize: 12, padding: '14px 0' }}>{commits.length ? '(END)' : t.logEmpty}</div>
    </main>
  )
}

export function NotFound() {
  const { t } = useApp()
  useTitle(t.notFound)
  return (
    <main className="wrap w-720">
      <div className="mono muted" style={{ fontSize: 12 }}>404</div>
      <h1 className="h1" style={{ marginTop: 12 }}>{t.notFound}</h1>
      <p className="intro">{t.notFoundBody}</p>
      <p style={{ marginTop: 24 }}><Link to="/" className="more">{t.goHome} →</Link></p>
    </main>
  )
}
