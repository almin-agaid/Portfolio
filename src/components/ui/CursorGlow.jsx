import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const SPRING = { stiffness: 150, damping: 24, mass: 0.6 }

// A soft orange light that trails the mouse pointer. It is fixed to the viewport, ignores clicks
// (pointer-events: none) and is faint enough not to hurt readability. Only a real mouse shows it:
// touch screens never see it (the CSS hides it on coarse pointers as well).
export default function CursorGlow() {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const placed = useRef(false) // false until the first move after (re)entering the window
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  // The spring makes the light drift after the pointer instead of snapping to it.
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)

  useEffect(() => {
    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return
      x.set(event.clientX)
      y.set(event.clientY)
      if (!placed.current) {
        // First move: put the light under the pointer straight away instead of gliding in from the corner.
        springX.jump(event.clientX)
        springY.jump(event.clientY)
        placed.current = true
        setVisible(true)
      }
    }
    const onLeave = () => {
      placed.current = false
      setVisible(false)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [x, y, springX, springY])

  return (
    <motion.div
      className={`cursor-glow${visible ? ' cursor-glow--on' : ''}`}
      // Visitors who prefer reduced motion get the light without the drifting spring.
      style={{ x: reduceMotion ? x : springX, y: reduceMotion ? y : springY }}
      aria-hidden="true"
    />
  )
}
