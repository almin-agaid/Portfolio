import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { setSmoothScroll } from '../lib/smoothScroll'

// Smooth, eased wheel scrolling for the whole page (Lenis). Anchor links (#about) glide too, and they honour
// each section's scroll-margin-top, so the fixed navbar never covers a heading. Off for visitors who prefer
// reduced motion, who keep the browser's normal scrolling.
export default function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return undefined
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true, anchors: true })
    setSmoothScroll(lenis)
    return () => {
      setSmoothScroll(null)
      lenis.destroy()
    }
  }, [enabled])
}
