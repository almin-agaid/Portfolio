import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Check } from 'lucide-react'
import { education } from '../data/portfolioData'
import { EASE, viewportOnce } from '../lib/motion'
import SectionHeading from './ui/SectionHeading'
import { getIcon } from './ui/icons'
import './Education.css'

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
}

export default function Education() {
  const listRef = useRef(null)

  // The timeline's accent line "fills" as the visitor scrolls through the list.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="education" className="section education" aria-labelledby="education-title">
      <div className="container education__layout">
        <div className="education__intro">
          <SectionHeading
            index="04"
            label="Education"
            id="education-title"
            title="Where I have studied"
            description="My academic path so far and the fundamentals it gave me."
          />
        </div>

        <ol ref={listRef} className="timeline">
          <span className="timeline__track" aria-hidden="true">
            <motion.span className="timeline__fill" style={{ scaleY }} />
          </span>

          {education.map((entry, index) => {
            const Icon = getIcon(entry.icon)
            return (
              <motion.li
                key={`${entry.id}-${index}`} /* the index keeps two entries with the same id from clashing */
                className="timeline__item"
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <span className="timeline__dot" aria-hidden="true">
                  <Icon size={18} />
                </span>

                <article className="timeline__card glow-border">
                  <p className="timeline__period mono">{entry.period}</p>
                  <h3 className="timeline__program">{entry.program}</h3>
                  <p className="timeline__institution">{entry.institution}</p>

                  {entry.highlights?.length > 0 && (
                    <ul className="timeline__highlights">
                      {entry.highlights.map((highlight) => (
                        <li key={highlight}>
                          <Check size={15} aria-hidden="true" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
