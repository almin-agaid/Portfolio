import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Menu, X } from 'lucide-react'
import { navLinks, profile } from '../data/portfolioData'
import useActiveSection from '../hooks/useActiveSection'
import useScrolled from '../hooks/useScrolled'
import { EASE } from '../lib/motion'
import LogoMark from './ui/Logo'
import ThemeToggle from './ui/ThemeToggle'
import './Navbar.css'

const sectionIds = navLinks.map((link) => link.id)

export default function Navbar({ ready }) {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(16)
  const active = useActiveSection(sectionIds)

  // While the mobile menu is open: Escape closes it, and so does growing past the breakpoint.
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false)
    const query = window.matchMedia('(min-width: 900px)')
    const onChange = () => query.matches && setOpen(false)
    document.addEventListener('keydown', onKeyDown)
    query.addEventListener('change', onChange)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      query.removeEventListener('change', onChange)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <motion.header
      className={`navbar ${scrolled || open ? 'navbar--solid' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <nav className="container navbar__inner" aria-label="Primary">
        <a href="#home" className="navbar__logo" onClick={close} aria-label={`${profile.name} - back to top`}>
          <LogoMark size={34} />
          <span>{profile.name}</span>
        </a>

        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="navbar__link"
                aria-current={active === link.id ? 'location' : undefined}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="navbar__underline"
                    style={{ borderRadius: 2 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="navbar__label">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          {profile.resume && (
            <a href={profile.resume} download className="navbar__cv">
              <Download size={16} aria-hidden="true" />
              <span>CV</span>
            </a>
          )}
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn navbar__toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="navbar__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              aria-hidden="true"
            />
            <motion.div
              key="panel"
              id="mobile-menu"
              className="navbar__mobile"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <ul>
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * index + 0.05, duration: 0.25 }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={close}
                      aria-current={active === link.id ? 'location' : undefined}
                    >
                      <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              {profile.resume && (
                <a href={profile.resume} download className="navbar__mobile-cv" onClick={close}>
                  <Download size={18} aria-hidden="true" />
                  Download CV
                </a>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
