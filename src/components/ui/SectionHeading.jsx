import { motion } from 'framer-motion'
import { fadeUp, revealOnScroll } from '../../lib/motion'

export default function SectionHeading({ index, label, title, description, id, align = 'left' }) {
  return (
    <motion.header className={`section-heading section-heading--${align}`} {...revealOnScroll(0.09)}>
      <motion.p className="section-heading__eyebrow mono" variants={fadeUp}>
        <span>{index}</span>
        <i aria-hidden="true" />
        {label}
      </motion.p>
      <motion.h2 id={id} className="section-heading__title" variants={fadeUp}>
        {title}
      </motion.h2>
      {description && (
        <motion.p className="section-heading__desc" variants={fadeUp}>
          {description}
        </motion.p>
      )}
    </motion.header>
  )
}
