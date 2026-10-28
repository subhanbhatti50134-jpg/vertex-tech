import { useEffect, useRef, useState } from 'react'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from './ThemeContext'

export default function Nav() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const links = [
    { href: '#hero', label: 'Home' },
    { href: '#projects', label: 'Work' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}
    >
      <div className="nav-inner">
        <a href="#hero" className="nav-brand" aria-label="Vertex Tech home">
          Vertex Tech
        </a>
        
        <ul id="nav-list" className={`nav-list ${open ? 'visible' : ''}`}>
          {links.map((link) => (
            <li key={link.href} className="nav-list__item">
              <a
                href={link.href}
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                <span className="nav-link__label">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button
            onClick={toggleTheme}
            className="nav-theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
          </button>

          <button
            className={`nav-menu-toggle ${open ? 'is-open' : ''}`}
            aria-expanded={open}
            aria-controls="nav-list"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
          </button>
        </div>
      </div>
    </nav>
  )
}