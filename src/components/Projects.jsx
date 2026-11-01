import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Images } from 'lucide-react'
import { projects } from '../data/portfolioData'
import { fadeUp, revealOnScroll } from '../lib/motion'
import Button from './ui/Button'
import { GithubIcon } from './ui/BrandIcons'
import ProjectModal from './ui/ProjectModal'
import ProjectThumb from './ui/ProjectThumb'
import SectionHeading from './ui/SectionHeading'
import './Projects.css'

function ProjectCard({ project, onOpen }) {
  return (
    <motion.li className="project" variants={fadeUp}>
      <motion.article className="project__card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
        <div className="project__media">
          <ProjectThumb project={project} />
          {project.year && <span className="project__year mono">{project.year}</span>}
        </div>

        <div className="project__body">
          <div className="project__head">
            <h3 className="project__title">{project.title}</h3>
            {project.badge && <span className="project__badge mono">{project.badge}</span>}
          </div>
          <p className="project__summary">{project.summary}</p>

          {project.tech?.length > 0 && (
            <div>
              <p id={`tech-${project.id}`} className="project__tech-label mono">
                Tech stack used
              </p>
              <ul className="tag-list" aria-labelledby={`tech-${project.id}`}>
                {project.tech.map((tech) => (
                  <li key={tech} className="tag">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="project__actions">
            <Button variant="subtle" icon={ArrowUpRight} onClick={onOpen} aria-haspopup="dialog">
              View details
              <span className="sr-only"> of {project.title}</span>
            </Button>

            <div className="project__links">
              {project.images?.length > 1 && (
                <span className="project__count mono">
                  <Images size={14} aria-hidden="true" />
                  {project.images.length} screenshots
                </span>
              )}
              {project.github && (
                <a
                  href={project.github}
                  className="icon-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} source code on GitHub`}
                  title="Source code"
                >
                  <GithubIcon size={19} />
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  className="icon-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} live demo`}
                  title="Live demo"
                >
                  <ExternalLink size={19} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </motion.li>
  )
}

export default function Projects() {
  const [selected, setSelected] = useState(null)
  const close = useCallback(() => setSelected(null), [])

  return (
    <section id="projects" className="section section--alt projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          index="03"
          label="Projects"
          id="projects-title"
          title="Selected projects"
          description="A few things I have built while learning. Open any project for the full story, features, and tech stack."
        />

        <motion.ul className="projects__grid" {...revealOnScroll(0.12)}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={() => setSelected(project)} />
          ))}
        </motion.ul>
      </div>

      <AnimatePresence>{selected && <ProjectModal key={selected.id} project={selected} onClose={close} />}</AnimatePresence>
    </section>
  )
}
