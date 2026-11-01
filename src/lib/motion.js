// Shared Framer Motion presets so every section animates with the same feel.
// Reduced-motion is handled globally by <MotionConfig reducedMotion="user"> in App.jsx,
// which turns transform/layout animations into instant changes for those users.

export const EASE = [0.22, 1, 0.36, 1]

// Trigger once, slightly before the element is fully in view.
export const viewportOnce = { once: true, amount: 0.15, margin: '0px 0px -40px 0px' }

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
}

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

// Props for a container whose motion children should reveal on scroll.
export const revealOnScroll = (staggerChildren = 0.08, delayChildren = 0) => ({
  variants: stagger(staggerChildren, delayChildren),
  initial: 'hidden',
  whileInView: 'show',
  viewport: viewportOnce,
})
