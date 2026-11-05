import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'

export type Commit = {
  hash: string
  short: string
  author: string
  date: string
  subject: string
  add: number
  del: number
}

const ID = 'virtual:git'
const RESOLVED = '\0' + ID
const FMT = '%x1e%h%x1f%H%x1f%an%x1f%aI%x1f%s'

function git(args: string[], cwd: string): string {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  } catch {
    return ''
  }
}

function parse(out: string): Commit[] {
  return out
    .split('\x1e')
    .filter(Boolean)
    .map((rec) => {
      const [head, ...rest] = rec.split('\n')
      const [short, hash, author, date, subject] = head.split('\x1f')
      const stat = rest.join(' ')
      const add = Number(/(\d+) insertion/.exec(stat)?.[1] ?? 0)
      const del = Number(/(\d+) deletion/.exec(stat)?.[1] ?? 0)
      return { short, hash, author, date, subject, add, del }
    })
}

/**
 * Exposes `virtual:git` with the repo's recent commits and the last commit
 * touching each post, read at build time. Empty when not in a git repo.
 * Also copies index.html to 404.html so static hosts (GitHub Pages) serve
 * the app for deep links.
 */
export function gitPlugin(root: string, postsDir: string): Plugin {
  let outDir = 'dist'
  return {
    name: 'site-git',
    configResolved(c) {
      outDir = c.build.outDir
    },
    resolveId(id) {
      return id === ID ? RESOLVED : undefined
    },
    load(id) {
      if (id !== RESOLVED) return
      const commits = parse(git(['log', '-n', '60', '--shortstat', `--format=${FMT}`], root))
      const files: Record<string, Commit> = {}
      const dir = join(root, postsDir)
      if (existsSync(dir)) {
        for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
          const [c] = parse(git(['log', '-1', '--shortstat', `--format=${FMT}`, '--', join(postsDir, f)], root))
          if (c) files[f.replace(/\.md$/, '')] = c
        }
      }
      return `export const commits = ${JSON.stringify(commits)};\nexport const postCommits = ${JSON.stringify(files)};`
    },
    writeBundle() {
      const index = join(root, outDir, 'index.html')
      if (existsSync(index)) copyFileSync(index, join(root, outDir, '404.html'))
    },
  }
}
