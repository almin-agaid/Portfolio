import { motion, useScroll, useSpring } from 'framer-motion'

// Thin reading-progress bar pinned to the top of the viewport.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}
