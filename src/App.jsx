import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion'
// Shared UI styles first so section-level CSS can override them at equal specificity.
import './components/ui/ui.css'
import About from './components/About'
import Contact from './components/Contact'
import Education from './components/Education'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import Skills from './components/Skills'
import BackToTop from './components/ui/BackToTop'
import BackgroundDecor from './components/ui/BackgroundDecor'
import Loader from './components/ui/Loader'
import ScrollProgress from './components/ui/ScrollProgress'

const MIN_LOADER_MS = 1000
const MAX_WAIT_MS = 2500

export default function App() {
  const [ready, setReady] = useState(false)
  const reduceMotion = useReducedMotion()

  // Show the loader briefly, but never longer than needed for the web fonts to be ready.
  useEffect(() => {
    let cancelled = false
    const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))
    const fonts = document.fonts?.ready ?? Promise.resolve()

    Promise.all([wait(reduceMotion ? 150 : MIN_LOADER_MS), Promise.race([fonts, wait(MAX_WAIT_MS)])]).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [reduceMotion])

  return (
    // "user" = honour the visitor's prefers-reduced-motion setting for every animation.
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!ready && <Loader key="loader" />}</AnimatePresence>

      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <BackgroundDecor />
      <ScrollProgress />
      <Navbar ready={ready} />

      <main id="main" tabIndex={-1}>
        <Hero ready={ready} />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </MotionConfig>
  )
}
