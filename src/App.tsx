import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AgentView } from './components/AgentView'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Search } from './components/Search'
import { findTopic, projects, site } from './data/site'
import { App as AppContext, readPref, writePref, type Theme } from './lib/app'
import { T, type Lang } from './lib/i18n'
import { getPost } from './lib/posts'
import { Article } from './pages/Article'
import { Home, TopicHub, Topics, Writing } from './pages/lists'
import { About, Log, NotFound, Notes, Project, Projects, Uses } from './pages/other'
import { useLocation } from './router'

function route(path: string): ReactNode {
  const seg = path.split('/').filter(Boolean)
  switch (seg[0]) {
    case undefined:
      return <Home />
    case 'writing':
      if (!seg[1]) return <Writing />
      return getPost(seg[1].replace(/\.md$/, '')) ? <Article key={seg[1]} slug={seg[1].replace(/\.md$/, '')} /> : <NotFound />
    case 'topics':
      if (!seg[1]) return <Topics />
      return findTopic(seg[1]) ? <TopicHub slug={seg[1]} /> : <NotFound />
    case 'projects':
      if (!seg[1]) return <Projects />
      return projects.some((p) => p.id === seg[1]) ? <Project id={seg[1]} /> : <NotFound />
    case 'notes':
      return <Notes />
    case 'about':
      return <About />
    case 'uses':
      return <Uses />
    case 'log':
      return <Log />
    default:
      return <NotFound />
  }
}

const systemTheme = (): Theme => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

export default function App() {
  const { path } = useLocation()
  const [lang, setLang] = useState<Lang>(() => readPref('lang', ['en', 'fr'] as const, navigator.language.startsWith('fr') ? 'fr' : 'en'))
  const [theme, setTheme] = useState<Theme>(() => readPref('theme', ['light', 'dark'] as const, systemTheme()))
  const [search, setSearch] = useState(false)
  const [agent, setAgent] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = lang
  }, [theme, lang])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearch((s) => !s)
      }
      if (e.key === 'Escape') {
        setSearch(false)
        setAgent(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleLang = useCallback(() => setLang((l) => { const n = l === 'en' ? 'fr' : 'en'; writePref('lang', n); return n }), [])
  const toggleTheme = useCallback(() => setTheme((th) => { const n = th === 'dark' ? 'light' : 'dark'; writePref('theme', n); return n }), [])

  const ctx = useMemo(
    () => ({ lang, t: T[lang], theme, toggleLang, toggleTheme, openSearch: () => setSearch(true), openAgent: () => { setSearch(false); setAgent(true) } }),
    [lang, theme, toggleLang, toggleTheme],
  )

  return (
    <AppContext.Provider value={ctx}>
      <div className="shell" data-theme={theme}>
        <Header path={path} brand={site.short} />
        {route(path)}
        <Footer />
        {agent && <AgentView path={path} onClose={() => setAgent(false)} />}
        {search && <Search onClose={() => setSearch(false)} />}
      </div>
    </AppContext.Provider>
  )
}
