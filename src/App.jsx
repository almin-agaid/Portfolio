import { useEffect, useState } from 'react'
import { MotionConfig, useReducedMotion } from 'framer-motion'
// Shared UI styles first so section-level CSS can override them at equal specificity.
import './components/ui/ui.css'
import About from './components/About'
import Contact from './components/Contact'
import Education from './components/Education'
import Footer from './components/Footer'
import Hero from './components/Hero'
import HelloTab from './components/HelloTab'
import Intro from './components/Intro'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import Skills from './components/Skills'
import BackToTop from './components/ui/BackToTop'
import BackgroundDecor from './components/ui/BackgroundDecor'
import CursorGlow from './components/ui/CursorGlow'
import ScrollProgress from './components/ui/ScrollProgress'
import { ResumeProvider } from './hooks/useResume'
import useSmoothScroll from './hooks/useSmoothScroll'

const MIN_LOADER_MS = 250 // a short beat before the opening scene starts assembling (there is no loader screen now)
const MAX_WAIT_MS = 2500

export default function App() {
  const [ready, setReady] = useState(false)
  const reduceMotion = useReducedMotion()
  useSmoothScroll(!reduceMotion)

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
      <ResumeProvider>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <BackgroundDecor />
        <CursorGlow />
        <ScrollProgress />
        <Navbar ready={ready} />
        <HelloTab />

        <main id="main" tabIndex={-1}>
          <Intro ready={ready} />
          {/* The site slides up over the pinned opening scene like a sheet. */}
          <div className="site">
            <Hero ready={ready} />
            <About />
            <Skills />
            <Projects />
            <Education />
            <Contact />
          </div>
        </main>

        <Footer />
        <BackToTop />
      </ResumeProvider>
    </MotionConfig>
  )
}
