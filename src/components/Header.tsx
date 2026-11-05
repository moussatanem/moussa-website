import { useState } from 'react'
import { useApp } from '../lib/app'
import { Link } from './Link'

const NAV = [
  ['home', '/'],
  ['writing', '/writing'],
  ['topics', '/topics'],
  ['projects', '/projects'],
  ['notes', '/notes'],
  ['about', '/about'],
] as const

function activeSection(path: string) {
  if (path === '/') return 'home'
  return NAV.find(([, to]) => to !== '/' && path.startsWith(to))?.[0]
}

export function Header({ path, brand }: { path: string; brand: string }) {
  const { t, lang, toggleLang, toggleTheme, openSearch, openAgent } = useApp()
  const [menu, setMenu] = useState(false)
  const active = activeSection(path)
  const close = () => setMenu(false)

  const themeBtn = (
    <button type="button" className="theme-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
      <span className="theme-dot" />
    </button>
  )

  return (
    <header className="header" data-noprint>
      <div className="header-inner">
        <Link to="/" className="brand" onClick={close}>
          {brand}
        </Link>
        <div className="desktop-only">
          <nav className="nav">
            {NAV.map(([k, to]) => (
              <Link key={k} to={to} className={active === k ? 'active' : ''}>
                {t.nav[k]}
              </Link>
            ))}
          </nav>
          <button type="button" className="search-btn" onClick={openSearch}>
            <span>{t.search}</span>
            <span className="kbd">⌘K</span>
          </button>
          <div className="tools">
            <button type="button" className="lang-btn" onClick={toggleLang} title="Language">
              <span className={lang === 'en' ? 'on' : 'off'}>EN</span>
              <span className="sep">/</span>
              <span className={lang === 'fr' ? 'on' : 'off'}>FR</span>
            </button>
            <button type="button" className="llms-btn" onClick={openAgent} title="Read this site the way an LLM does">
              /llms.txt
            </button>
            {themeBtn}
          </div>
        </div>
        <div className="mobile-only">
          <div className="mobile-tools">
            <button type="button" className="text-btn" onClick={openSearch}>
              {t.search}
            </button>
            {themeBtn}
            <button type="button" className="menu-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
              {menu ? t.close : t.menu}
            </button>
          </div>
        </div>
      </div>
      {menu && (
        <div className="menu mobile-only-block">
          {NAV.map(([k, to]) => (
            <Link key={k} to={to} className={active === k ? 'active' : ''} onClick={close}>
              {t.nav[k]}
            </Link>
          ))}
          <button type="button" className="mono-link" onClick={() => { close(); openAgent() }}>
            {t.viewAsAgent}
          </button>
          <button type="button" className="mono-link" onClick={toggleLang}>
            <span style={{ color: lang === 'en' ? 'var(--ink)' : 'var(--muted)' }}>English</span>
            <span>/</span>
            <span style={{ color: lang === 'fr' ? 'var(--ink)' : 'var(--muted)' }}>Français</span>
          </button>
        </div>
      )}
    </header>
  )
}
