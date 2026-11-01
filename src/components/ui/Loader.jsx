import { motion } from 'framer-motion'
import LogoMark from './Logo'

// Short branded intro shown while fonts load. App removes it via AnimatePresence.
export default function Loader() {
  return (
    <motion.div
      className="loader"
      role="status"
      aria-live="polite"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
    >
      <div className="loader__inner">
        <LogoMark draw size={72} />
        <div className="loader__bar" aria-hidden="true">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
        </div>
        <span className="sr-only">Loading portfolio</span>
      </div>
    </motion.div>
  )
}
