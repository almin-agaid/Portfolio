import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { footer, navLinks, profile, socials } from '../data/portfolioData'
import { fadeUp, revealOnScroll } from '../lib/motion'
import LogoMark from './ui/Logo'
import { socialIcons } from './ui/BrandIcons'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <motion.div className="footer__top" {...revealOnScroll(0.1)}>
          <motion.div className="footer__brand" variants={fadeUp}>
            <a href="#home" className="footer__logo">
              <LogoMark size={34} />
              <span>{profile.name}</span>
            </a>
            <p>{footer.tagline}</p>
          </motion.div>

          <motion.nav className="footer__nav" aria-label="Footer" variants={fadeUp}>
            <h2 className="footer__heading mono">Navigate</h2>
            <ul>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`}>{link.label}</a>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.div className="footer__connect" variants={fadeUp}>
            <h2 className="footer__heading mono">Connect</h2>
            <ul className="footer__socials">
              {socials.map((social) => {
                const Icon = socialIcons[social.id]
                if (!Icon || !social.url) return null
                const external = !social.url.startsWith('mailto:')
                return (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      className="icon-btn"
                      aria-label={social.label}
                      title={social.label}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <Icon size={19} />
                    </a>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </motion.div>

        <div className="footer__bottom">
          <p>
            &copy; {year} {profile.name}. All rights reserved.
          </p>
          <p className="footer__built mono">Built with React, Vite &amp; Framer Motion</p>
          <motion.button
            type="button"
            className="footer__top-btn"
            onClick={() => window.scrollTo({ top: 0 })}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Back to top
            <ArrowUp size={16} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
