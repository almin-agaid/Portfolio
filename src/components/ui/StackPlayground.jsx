import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Vibrate } from 'lucide-react'
import { skillCategories } from '../../data/portfolioData'
import { fadeUp, viewportOnce } from '../../lib/motion'
import { createToybox } from '../../lib/toybox'
import TechIcon from './TechIcon'
import { hasLogo, techIcons, toSkill } from './techIcons'
import './StackPlayground.css'

// Every skill that has a logo, once each, straight from the data file: the box follows the skills list.
const seen = new Set()
const TILES = skillCategories
  .flatMap((category) => category.skills.map(toSkill))
  .filter((skill) => hasLogo(skill) && !seen.has(skill.icon) && seen.add(skill.icon))

// A toy box under the skills: the logos fall in when it scrolls into view, and can be grabbed, thrown and poked.
// The physics library is only downloaded once the box is about to be seen. To remove the box, delete the
// <StackPlayground /> line in Skills.jsx.
export default function StackPlayground() {
  const reduceMotion = useReducedMotion()
  const boxRef = useRef(null)
  const holders = useRef([])
  const spins = useRef([])
  const toy = useRef(null)

  useEffect(() => {
    const box = boxRef.current
    let cancelled = false

    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        watcher.disconnect()
        import('matter-js').then((module) => {
          if (cancelled) return
          toy.current = createToybox(module.default ?? module, {
            box,
            holders: holders.current,
            spins: spins.current,
            reduceMotion: Boolean(reduceMotion),
          })
        })
      },
      { threshold: 0.3 },
    )
    watcher.observe(box)

    return () => {
      cancelled = true
      watcher.disconnect()
      toy.current?.destroy()
      toy.current = null
    }
  }, [reduceMotion])

  if (TILES.length === 0) return null

  return (
    <motion.div className="toybox" variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
      <div className="toybox__head">
        <div>
          <h3 className="toybox__title">Play with my stack</h3>
          <p className="toybox__hint">Every tool listed above, in a box. Grab one, throw it, or give it a poke.</p>
        </div>
        <button type="button" className="toybox__shake" onClick={() => toy.current?.shake()}>
          <Vibrate size={16} aria-hidden="true" />
          Shake
        </button>
      </div>

      {/* decorative: the same skills are listed in the cards above */}
      <div className="toybox__box" ref={boxRef} aria-hidden="true">
        {TILES.map((skill, index) => (
          <div
            key={skill.icon}
            className="toybox__body"
            data-tile={index}
            data-label={skill.name}
            style={{ '--tile-color': techIcons[skill.icon].color }}
            ref={(element) => {
              holders.current[index] = element
            }}
          >
            <div
              className="toy-tile"
              ref={(element) => {
                spins.current[index] = element
              }}
            >
              <TechIcon name={skill.icon} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
