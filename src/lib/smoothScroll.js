// The page's smooth-scroll engine (Lenis), shared so buttons can scroll through it instead of jumping.
let engine = null

export const setSmoothScroll = (instance) => {
  engine = instance
}

// Scrolls to a vertical position: smoothly through Lenis while it is running, otherwise with the
// browser's own smooth scrolling.
export function scrollToY(top) {
  if (engine) engine.scrollTo(top)
  else window.scrollTo({ top, behavior: 'smooth' })
}
