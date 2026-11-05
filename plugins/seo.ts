import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'

const ROUTES = [
  '/',
  '/about',
  '/projects',
  '/projects/ekmo',
  '/writing',
  '/notes',
  '/topics',
  '/uses',
  '/log',
  '/cv.pdf',
  '/llms.txt',
]

function siteUrl(root: string): string {
  const src = readFileSync(join(root, 'src/data/site.ts'), 'utf8')
  return /url:\s*'([^']*)'/.exec(src)?.[1] ?? ''
}

/**
 * Ensures robots.txt (and sitemap.xml when `site.url` is set) land in the
 * build output. Dev serves the copies under /public.
 */
export function seoPlugin(root: string): Plugin {
  let outDir = 'dist'
  return {
    name: 'seo',
    configResolved(cfg) {
      outDir = cfg.build.outDir
    },
    closeBundle() {
      const url = siteUrl(root).replace(/\/$/, '')
      const robots = [
        '# https://www.robotstxt.org/robotstxt.html',
        'User-agent: *',
        'Allow: /',
        '',
        'Allow: /llms.txt',
        'Allow: /cv.pdf',
        ...(url ? ['', `Sitemap: ${url}/sitemap.xml`] : []),
        '',
      ].join('\n')
      writeFileSync(join(outDir, 'robots.txt'), robots)

      if (!url) return

      const today = new Date().toISOString().slice(0, 10)
      const urls = ROUTES.map(
        (path) => `  <url>
    <loc>${url}${path === '/' ? '/' : path}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
      ).join('\n')
      writeFileSync(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
      )
    },
  }
}
