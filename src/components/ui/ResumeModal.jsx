import { useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { profile } from '../../data/portfolioData'
import useModal from '../../hooks/useModal'
import { EASE } from '../../lib/motion'
import './ResumeModal.css'

// Options for the browser's built-in PDF viewer: no toolbar (so no download or print buttons), fit to width.
const VIEWER = '#toolbar=0&navpanes=0&view=FitH'

// The resume as a pop-up preview, shown on top of the page.
export default function ResumeModal({ onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  useModal(panelRef, closeRef, onClose)

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
        className="modal__panel resume-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-title"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <div className="resume-modal__bar">
          <h3 id="resume-title" className="resume-modal__title mono">
            {profile.name} - Resume
          </h3>
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Close resume preview">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* If the browser cannot show PDFs inline (some phones), the text inside the object is shown instead. */}
        <object className="resume-modal__frame" data={`${profile.resume}${VIEWER}`} type="application/pdf" aria-label="Resume preview">
          <p className="resume-modal__fallback">
            Your browser cannot show the PDF here.{' '}
            <a href={profile.resume} target="_blank" rel="noopener noreferrer">
              Open the resume
            </a>{' '}
            instead.
          </p>
        </object>
      </motion.div>
    </motion.div>
  )
}
