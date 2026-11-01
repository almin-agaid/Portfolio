import { motion } from 'framer-motion'
import { Check, GraduationCap, Target } from 'lucide-react'
import { about, education } from '../data/portfolioData'
import { fadeUp, revealOnScroll, slideInLeft } from '../lib/motion'
import SectionHeading from './ui/SectionHeading'
import { getIcon } from './ui/icons'
import './About.css'

export default function About() {
  const current = education[0]

  return (
    <section id="about" className="section section--alt about" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading index="01" label="About" id="about-title" title="A little about me" />

        <div className="about__grid">
          {/* Left column: story + quick facts */}
          <motion.div className="about__story" {...revealOnScroll(0.1)}>
            {about.bio.map((paragraph) => (
              <motion.p key={paragraph} variants={fadeUp}>
                {paragraph}
              </motion.p>
            ))}

            <motion.dl className="about__facts" variants={fadeUp}>
              {about.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="mono">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* Right column: education, interests, goals */}
          <motion.div className="about__cards" {...revealOnScroll(0.12)}>
            {current && (
              <motion.article className="about-card" variants={slideInLeft}>
                <span className="about-card__icon">
                  <GraduationCap size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="about-card__title">Education</h3>
                  <p className="about-card__strong">{current.program}</p>
                  <p className="about-card__muted">
                    {current.institution} <span className="mono">· {current.period}</span>
                  </p>
                </div>
              </motion.article>
            )}

            <motion.article className="about-card about-card--stack" variants={slideInLeft}>
              <h3 className="about-card__title">Interests</h3>
              <ul className="about__interests">
                {about.interests.map((interest) => {
                  const Icon = getIcon(interest.icon)
                  return (
                    <li key={interest.label}>
                      <Icon size={16} aria-hidden="true" />
                      {interest.label}
                    </li>
                  )
                })}
              </ul>
            </motion.article>

            <motion.article className="about-card" variants={slideInLeft}>
              <span className="about-card__icon about-card__icon--alt">
                <Target size={20} aria-hidden="true" />
              </span>
              <div>
                <h3 className="about-card__title">Career goals</h3>
                <p className="about-card__muted">{about.goals.summary}</p>
                <ul className="about__goals">
                  {about.goals.items.map((goal) => (
                    <li key={goal}>
                      <Check size={15} aria-hidden="true" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
