import type { ReactNode } from 'react'
import { useApp } from '../lib/app'
import { fmtDate } from '../lib/i18n'
import type { Maturity, Post } from '../lib/posts'
import { Link } from './Link'

const DOT = { solid: 'solid', 'in-progress': 'progress', draft: '' } as const

export function Dot({ m, title }: { m: Maturity; title?: string }) {
  return <span className={'dot ' + DOT[m]} title={title} />
}

export function Mat({ m }: { m: Maturity }) {
  const { t } = useApp()
  return (
    <span className="mat" title={t.maturityHint[m]}>
      <Dot m={m} />
      {t.maturity[m]}
    </span>
  )
}

export function PostRow({ post, short, showMat }: { post: Post; short?: boolean; showMat?: boolean }) {
  const { lang } = useApp()
  return (
    <Link to={`/writing/${post.slug}`} className="row">
      <span className={'date' + (short ? ' short' : '')}>{fmtDate(post.date, lang, { year: !short })}</span>
      <span className="title">{post.title}</span>
      {showMat && <Mat m={post.maturity} />}
      {post.topic && <span className="pill">{post.topic.name[lang]}</span>}
    </Link>
  )
}

export function Placeholder({ label, ratio = '16/8', caption }: { label: string; ratio?: string; caption?: ReactNode }) {
  return (
    <figure style={{ margin: '28px 0' }}>
      <div className="placeholder" style={{ aspectRatio: ratio }}>
        <span>{label}</span>
      </div>
      {caption && <figcaption style={{ fontSize: 14, color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>{caption}</figcaption>}
    </figure>
  )
}

export function Empty() {
  const { t } = useApp()
  return <div className="empty">{t.nothingYet}</div>
}
