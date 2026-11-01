import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, ExternalLink, X } from 'lucide-react'
import useModal from '../../hooks/useModal'
import { EASE } from '../../lib/motion'
import { GithubIcon } from './BrandIcons'
import Button from './Button'
import ProjectGallery from './ProjectGallery'

export default function ProjectModal({ project, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const titleId = `project-title-${project.id}`

  useModal(panelRef, closeRef, onClose)

  const hasLinks = project.github || project.live

  return (
    <motion.div
      className="modal"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        ref={panelRef}
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <button ref={closeRef} type="button" className="icon-btn modal__close" onClick={onClose} aria-label="Close project details">
          <X size={20} aria-hidden="true" />
        </button>

        <div className="modal__media">
          <ProjectGallery project={project} />
        </div>

        <div className="modal__body">
          {(project.badge || project.year) && (
            <p className="modal__meta mono">{[project.badge, project.year].filter(Boolean).join(' · ')}</p>
          )}
          <h3 id={titleId} className="modal__title">
            {project.title}
          </h3>
          <p className="modal__desc">{project.description}</p>

          {project.features?.length > 0 && (
            <>
              <h4 className="modal__label mono">Key features</h4>
              <ul className="modal__features">
                {project.features.map((feature) => (
                  <li key={feature}>
                    <Check size={16} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {project.tech?.length > 0 && (
            <>
              <h4 className="modal__label mono">Tech stack used</h4>
              <ul className="tag-list">
                {project.tech.map((tech) => (
                  <li key={tech} className="tag">
                    {tech}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="modal__actions">
            {project.github && (
              <Button href={project.github} external variant="primary" icon={GithubIcon} iconPosition="start">
                View source
              </Button>
            )}
            {project.live && (
              <Button href={project.live} external variant="ghost" icon={ExternalLink}>
                Live demo
              </Button>
            )}
            {!hasLinks && <p className="modal__note">Source code and a live demo will be linked here once published.</p>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
