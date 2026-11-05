import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import diff from 'highlight.js/lib/languages/diff'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import go from 'highlight.js/lib/languages/go'
import ini from 'highlight.js/lib/languages/ini'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import nginx from 'highlight.js/lib/languages/nginx'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import { Marked, type Tokens } from 'marked'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('diff', diff)
hljs.registerLanguage('dockerfile', dockerfile)
hljs.registerLanguage('go', go)
hljs.registerLanguage('ini', ini)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('nginx', nginx)
hljs.registerLanguage('python', python)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('yaml', yaml)
hljs.registerAliases(['sh', 'shell', 'zsh'], { languageName: 'bash' })
hljs.registerAliases(['ts', 'tsx'], { languageName: 'typescript' })
hljs.registerAliases(['js', 'jsx'], { languageName: 'javascript' })
hljs.registerAliases(['yml'], { languageName: 'yaml' })
hljs.registerAliases(['toml', 'conf'], { languageName: 'ini' })
hljs.registerAliases(['html', 'svg'], { languageName: 'xml' })

export type TocEntry = { id: string; label: string; depth: number }
export type Rendered = { html: string; toc: TocEntry[]; codeBlocks: number; incidents: number }

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Parses a fence info string like `bash title="backup.sh"`. */
function parseInfo(info = '') {
  const lang = info.match(/^\S*/)?.[0] ?? ''
  const title = /title=(?:"([^"]*)"|'([^']*)'|(\S+))/.exec(info)
  return { lang, title: title ? (title[1] ?? title[2] ?? title[3]) : '' }
}

function highlight(code: string, lang: string) {
  if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value
  return esc(code)
}

const COPY = '<button type="button" class="copy" data-copy>Copy</button>'

const LABELS: Record<string, Record<string, string>> = {
  en: { NOTE: 'Note', TIP: 'Tip', IMPORTANT: 'Important', WARNING: 'Warning', CAUTION: 'Caution' },
  fr: { NOTE: 'Note', TIP: 'Astuce', IMPORTANT: 'Important', WARNING: 'Attention', CAUTION: 'Prudence' },
}

/**
 * Renders a post body. Supported extras on top of GitHub-flavoured markdown:
 *  - ```lang title="file.sh"   code block with a header and copy button
 *  - ```cmd                    one-line shell command with a `$` and copy button
 *  - ```terminal title="host"  dark terminal output, lines starting with `$` are prompts
 *  - > [!NOTE] / [!TIP] / [!WARNING] / [!CAUTION] Custom title
 *  - ![alt](image.png "caption")  rendered as a figure; src `placeholder` draws a hatched box
 */
export function renderMarkdown(src: string, opts: { lang: string; resolveAsset: (p: string) => string }): Rendered {
  const toc: TocEntry[] = []
  const seen = new Map<string, number>()
  let codeBlocks = 0
  let incidents = 0
  const labels = LABELS[opts.lang] ?? LABELS.en

  const md = new Marked({ gfm: true })
  md.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens)
        let id = slugify(inner) || 'section'
        const n = seen.get(id) ?? 0
        seen.set(id, n + 1)
        if (n) id += '-' + n
        if (depth === 2 || depth === 3) toc.push({ id, label: inner.replace(/<[^>]+>/g, ''), depth })
        return `<h${depth} id="${id}" data-toc>${inner}</h${depth}>\n`
      },
      code({ text, lang: info }: Tokens.Code) {
        const { lang, title } = parseInfo(info)
        if (lang === 'cmd') {
          codeBlocks++
          return `<div class="cmd"><span class="ps">$</span><code>${esc(text.replace(/^\$\s*/, ''))}</code>${COPY}</div>`
        }
        if (lang === 'terminal') {
          const lines = text
            .split('\n')
            .map((l) => (l.startsWith('$') ? `<span class="prompt">${esc(l)}</span>` : esc(l)))
            .join('\n')
          const head = `<div class="term-head">terminal${title ? ' · ' + esc(title) : ''}</div>`
          return `<div class="term">${head}<pre>${lines}</pre></div>`
        }
        codeBlocks++
        const label = title || lang
        const body = `<pre><code class="hljs">${highlight(text, lang)}</code></pre>`
        if (!label) return `<div class="code bare">${COPY}${body}</div>`
        return `<div class="code"><div class="code-head"><span>${esc(label)}</span>${COPY}</div>${body}</div>`
      },
      blockquote({ tokens }: Tokens.Blockquote) {
        const inner = this.parser.parse(tokens)
        const m = /^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*([^\n<]*)\n?/.exec(inner)
        if (!m) return `<blockquote>${inner}</blockquote>`
        const kind = m[1]
        if (kind === 'CAUTION') incidents++
        const rest = inner.slice(m[0].length)
        const body = rest.startsWith('</p>') ? rest.slice(4) : '<p>' + rest
        return `<div class="callout callout-${kind.toLowerCase()}"><div class="label">${m[2].trim() || labels[kind]}</div>${body}</div>`
      },
      image({ href, title, text }: Tokens.Image) {
        const cap = title ? `<figcaption>${esc(title)}</figcaption>` : ''
        if (href === 'placeholder')
          return `<figure><div class="placeholder" style="aspect-ratio:16/7"><span>${esc(text)}</span></div>${cap}</figure>`
        return `<figure><img src="${esc(opts.resolveAsset(href))}" alt="${esc(text)}" loading="lazy">${cap}</figure>`
      },
    },
    hooks: {
      postprocess(html: string) {
        return html
          .replace(/<p>\s*(<figure>[\s\S]*?<\/figure>)\s*<\/p>/g, '$1')
          .replace(/<table>/g, '<div class="table"><table>')
          .replace(/<\/table>/g, '</table></div>')
      },
    },
  })

  const html = md.parse(src, { async: false }) as string
  return { html, toc, codeBlocks, incidents }
}

/** Minimal YAML front-matter: `key: value`, quoted strings, `[a, b]` lists, booleans. */
export function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!m) return { data: {}, body: raw }
  const data: Record<string, unknown> = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([\w-]+):\s*(.*)$/.exec(line)
    if (!kv) continue
    let v = kv[2].trim()
    if (!/^['"]/.test(v)) v = v.replace(/\s+#.*$/, '')
    const unq = (s: string) => s.replace(/^(['"])(.*)\1$/, '$2')
    if (v.startsWith('[') && v.endsWith(']'))
      data[kv[1]] = v.slice(1, -1).split(',').map((s) => unq(s.trim())).filter(Boolean)
    else if (v === 'true' || v === 'false') data[kv[1]] = v === 'true'
    else data[kv[1]] = unq(v)
  }
  return { data, body: raw.slice(m[0].length) }
}
