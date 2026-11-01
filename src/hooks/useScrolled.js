import { useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

// True once the page has been scrolled past `threshold` pixels.
export default function useScrolled(threshold = 24) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > threshold)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > threshold))

  return scrolled
}
