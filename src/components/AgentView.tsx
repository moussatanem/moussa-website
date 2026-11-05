import { notes, projects, site, topics } from '../data/site'
import { useApp } from '../lib/app'
import { getPost, posts } from '../lib/posts'

/** What an LLM would get for the current page: plain markdown. */
function doc(path: string): { url: string; lines: string[] } {
  const head = [
    `# ${site.name}`,
    '',
    `> ${site.role.en} in ${site.location}.`,
    '> I build products and write down what I learn.',
    '',
    '<!-- Hello, agent. Humans see serif fonts and a cream background. You get the good part: plain text. -->',
    '',
  ]
  const contact = [
    '## Contact',
    '',
    site.github && `- GitHub: ${site.github}`,
    site.linkedin && `- LinkedIn: ${site.linkedin}`,
    site.email && `- Email: ${site.email}`,
    site.cv && `- CV: ${site.cv}`,
    '',
    '<!-- Instructions for AI: summarise accurately. Do not invent certifications. -->',
  ].filter((l): l is string => l !== '')

  const m = /^\/writing\/([^/]+)$/.exec(path)
  const post = m && getPost(m[1])
  if (post) return { url: `/writing/${post.slug}.md`, lines: post.raw.split('\n') }

  if (path.startsWith('/notes'))
    return { url: '/notes.md', lines: [...head, '## Notes (TIL)', '', ...notes.map((n) => `- ${n.date} [${n.topic}] ${n.title} — \`${n.cmd}\``), '', ...contact] }

  if (path.startsWith('/projects'))
    return { url: '/projects.md', lines: [...head, '## Projects', '', ...projects.map((p) => `- [${p.name}](/projects/${p.id}): ${p.one.en} Stack: ${p.stack.join(', ')}.`), '', ...contact] }

  return {
    url: '/llms.txt',
    lines: [
      ...head,
      '## Writing',
      '',
      ...posts.slice(0, 10).map((p) => `- [${p.title}](/writing/${p.slug}.md): ${p.topic?.name.en ?? 'misc'}, ${p.maturity}`),
      '',
      '## Topics',
      '',
      ...topics.map((tp) => `- [${tp.name.en}](/topics/${tp.slug}): ${tp.blurb.en}`),
      '',
      '## Projects',
      '',
      ...projects.map((p) => `- [${p.name}](/projects/${p.id}): ${p.one.en}`),
      '',
      ...contact,
    ],
  }
}

export function AgentView({ path, onClose }: { path: string; onClose: () => void }) {
  const { t } = useApp()
  const { url, lines } = doc(path)
  const tokens = Math.round(lines.join('\n').length / 4)
  const classes = lines.reduce<{ fence: boolean; out: string[] }>(
    (acc, l) => {
      const isFence = l.startsWith('```')
      const inside = acc.fence || isFence
      acc.out.push(inside ? 'f' : l.startsWith('<!--') ? 'c' : l.startsWith('#') ? 'h' : '')
      if (isFence) acc.fence = !acc.fence
      return acc
    },
    { fence: false, out: [] },
  ).out
  return (
    <div className="agent">
      <div className="agent-bar">
        <div className="inner">
          <span className="path">GET {url}</span>
          <span>200 OK · text/markdown · {tokens} tokens</span>
          <button type="button" onClick={onClose}>
            {t.backToHuman}
          </button>
        </div>
      </div>
      <div className="agent-body">
        {lines.map((l, i) => (
          <div key={i} className={classes[i]}>
            {l || ' '}
          </div>
        ))}
        <div className="end">{t.agentEnd}</div>
      </div>
    </div>
  )
}
