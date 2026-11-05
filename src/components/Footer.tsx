import { site } from '../data/site'
import { useApp } from '../lib/app'
import { Link } from './Link'

const uptime = Math.floor((Date.now() - new Date(site.upSince).getTime()) / 864e5)

export function Footer() {
  const { t, openAgent } = useApp()
  return (
    <footer className="site-foot" data-noprint>
      <div className="inner">
        <div className="left">
          <span>
            © {new Date().getFullYear()} {site.name} · {t.footer}
          </span>
          <span className="status">
            <i />
            <span>
              {t.up} {uptime}d
            </span>
          </span>
        </div>
        <div className="links">
          <Link to="/uses">/uses</Link>
          <Link to="/log">git log</Link>
          <button type="button" onClick={openAgent}>
            {t.forAgents}
          </button>
          {site.github && <a href={site.github}>GitHub</a>}
          {site.linkedin && <a href={site.linkedin}>LinkedIn</a>}
          {site.email && <a href={'mailto:' + site.email}>Email</a>}
        </div>
      </div>
    </footer>
  )
}
