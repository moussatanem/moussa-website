import { useSyncExternalStore } from 'react'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

function subscribe(cb: () => void) {
  window.addEventListener('popstate', cb)
  return () => window.removeEventListener('popstate', cb)
}

function currentPath() {
  const p = window.location.pathname
  const rel = p.startsWith(BASE) ? p.slice(BASE.length) : p
  return (rel.replace(/\/+$/, '') || '/') + window.location.search
}

/** Current path (without base) and query string. */
export function useLocation() {
  const full = useSyncExternalStore(subscribe, currentPath)
  const i = full.indexOf('?')
  return i < 0 ? { path: full, query: new URLSearchParams() } : { path: full.slice(0, i), query: new URLSearchParams(full.slice(i)) }
}

export function href(to: string) {
  return BASE + to
}

export function navigate(to: string, opts: { replace?: boolean; keepScroll?: boolean } = {}) {
  if (to === currentPath()) return
  window.history[opts.replace ? 'replaceState' : 'pushState'](null, '', href(to))
  window.dispatchEvent(new PopStateEvent('popstate'))
  if (!opts.keepScroll) window.scrollTo(0, 0)
}
