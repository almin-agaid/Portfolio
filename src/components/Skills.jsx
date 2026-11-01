import { motion } from 'framer-motion'
import { skillCategories } from '../data/portfolioData'
import { EASE, fadeUp, revealOnScroll } from '../lib/motion'
import SectionHeading from './ui/SectionHeading'
import StackPlayground from './ui/StackPlayground'
import TechIcon from './ui/TechIcon'
import { getIcon } from './ui/icons'
import { hasLogo, techIcons, toSkill } from './ui/techIcons'
import './Skills.css'

// Logo tiles pop in one after another once their card has been revealed.
const tilePop = {
  hidden: { opacity: 0, scale: 0.8 },
  show: (index) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE, delay: 0.25 + index * 0.07 },
  }),
}

export default function Skills() {
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading
          index="02"
          label="Skills"
          id="skills-title"
          title="Technical skills"
          description="The languages, tools, and fundamentals I work with. I would rather list what I can genuinely use than pad out a chart."
        />

        <motion.ul className="skills__grid" {...revealOnScroll(0.09)}>
          {skillCategories.map((category) => {
            const Icon = getIcon(category.icon)
            const skills = category.skills.map(toSkill)
            const logos = skills.filter(hasLogo)
            const chips = skills.filter((skill) => !hasLogo(skill))

            return (
              <motion.li key={category.id} className="skill-card glow-border" variants={fadeUp} whileHover={{ y: -5 }}>
                <div className="skill-card__head">
                  <span className="skill-card__icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="skill-card__title">{category.title}</h3>
                    {category.description && <p className="skill-card__desc">{category.description}</p>}
                  </div>
                </div>

                <div className="skill-card__body">
                  {logos.length > 0 && (
                    <ul className="skill-card__logos" aria-label={`${category.title} skills`}>
                      {logos.map((skill, index) => (
                        <motion.li
                          key={skill.name}
                          className="tech-tile"
                          data-label={skill.name}
                          style={{ '--tile-color': techIcons[skill.icon].color }}
                          variants={tilePop}
                          custom={index}
                          whileHover={{ y: -4 }}
                        >
                          <TechIcon name={skill.icon} />
                          <span className="sr-only">{skill.name}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {chips.length > 0 && (
                    <ul className="skill-card__chips" aria-label={`${category.title} skills`}>
                      {chips.map((skill) => (
                        <li key={skill.name}>{skill.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.li>
            )
          })}
        </motion.ul>

        <StackPlayground />
      </div>
    </section>
  )
}
