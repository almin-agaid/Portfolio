import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, Download, Mail } from 'lucide-react'
import { profile, socials } from '../data/portfolioData'
import { EASE, fadeUp, scaleIn, stagger } from '../lib/motion'
import Button from './ui/Button'
import { socialIcons } from './ui/BrandIcons'
import { getIcon } from './ui/icons'
import './Hero.css'

// Each word slides up from behind a mask for a clean headline reveal.
const wordReveal = {
  hidden: { y: '115%' },
  show: { y: '0%', transition: { duration: 0.75, ease: EASE } },
}

const initials = profile.name
  .split(/\s+/)
  .map((word) => word[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()

export default function Hero({ ready }) {
  const words = profile.name.split(/\s+/)

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <motion.div
        className="container hero__grid"
        variants={stagger(0.12, 0.05)}
        initial="hidden"
        animate={ready ? 'show' : 'hidden'}
      >
        <div className="hero__content">
          {profile.availability && (
            <motion.p className="hero__status mono" variants={fadeUp}>
              <span className="hero__pulse" aria-hidden="true" />
              {profile.availability}
            </motion.p>
          )}

          <motion.p className="hero__greeting" variants={fadeUp}>
            {profile.greeting}
          </motion.p>

          <motion.h1
            id="hero-title"
            className="hero__name"
            aria-label={profile.name}
            variants={stagger(0.1)}
          >
            {words.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <span className="hero__mask" aria-hidden="true">
                  <motion.span
                    className={`hero__word ${index === words.length - 1 && words.length > 1 ? 'hero__word--accent' : ''}`}
                    variants={wordReveal}
                  >
                    {word}
                  </motion.span>
                </span>
                {/* The space must sit outside the overflow-clipped mask or it collapses */}
                {index < words.length - 1 && ' '}
              </Fragment>
            ))}
          </motion.h1>

          <motion.ul className="hero__roles" variants={fadeUp} aria-label="Roles">
            {profile.roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </motion.ul>

          <motion.p className="hero__intro" variants={fadeUp}>
            {profile.intro}
          </motion.p>

          <motion.div className="hero__cta" variants={fadeUp}>
            <Button href="#projects" icon={ArrowRight}>
              View My Projects
            </Button>
            <Button href="#contact" variant="ghost" icon={Mail} iconPosition="start">
              Contact Me
            </Button>
            {profile.resume && (
              <Button href={profile.resume} variant="subtle" icon={Download} iconPosition="start" download>
                Download CV
              </Button>
            )}
          </motion.div>

          <motion.ul className="hero__socials" variants={fadeUp} aria-label="Social links">
            {socials.map((social) => {
              const Icon = socialIcons[social.id]
              if (!Icon || !social.url) return null
              const external = !social.url.startsWith('mailto:')
              return (
                <li key={social.id}>
                  <motion.a
                    href={social.url}
                    className="icon-btn"
                    aria-label={social.label}
                    title={social.label}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.94 }}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <Icon size={20} />
                  </motion.a>
                </li>
              )
            })}
          </motion.ul>
        </div>

        <motion.div className="hero__visual" variants={scaleIn}>
          <div className="profile">
            <div className="profile__orbit" aria-hidden="true" />
            <div className="profile__frame" aria-hidden="true" />

            <motion.div
              className="profile__float"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="profile__card">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={`Portrait of ${profile.name}`}
                    width="520"
                    height="520"
                    fetchPriority="high"
                    decoding="async"
                  />
                ) : (
                  <div className="profile__placeholder" role="img" aria-label={`${profile.name} profile placeholder`}>
                    <span>{initials}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {profile.badges?.slice(0, 3).map((badge, index) => {
              const Icon = getIcon(badge.icon)
              return (
                <motion.div
                  key={badge.label}
                  className={`profile__chip profile__chip--${index + 1}`}
                  animate={{ y: [0, index % 2 ? 9 : -9, 0] }}
                  transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.7 }}
                >
                  <Icon size={16} aria-hidden="true" />
                  {badge.label}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-label="Scroll to the About section"
      >
        <span className="mono">Scroll</span>
        <ArrowDown size={16} aria-hidden="true" />
      </motion.a>
    </section>
  )
}
