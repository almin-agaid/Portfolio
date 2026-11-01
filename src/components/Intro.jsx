import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { profile } from '../data/portfolioData'
import { createClockPlay } from '../lib/clockPlay'
import { sheetClip, sheetRadius } from '../lib/sheet'
import { scrollToY } from '../lib/smoothScroll'
import './Intro.css'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const pad = (value) => String(value).padStart(2, '0')
const brand = profile.brand || profile.name

// ---------- the dot grid ----------
// 13 x 9 cells; each dot fades in a little later the farther it is from the centre (a wave from the middle).
const COLS = 13
const ROWS = 9
const DOTS = Array.from({ length: COLS * ROWS }, (_, index) => {
  const distance = Math.hypot((index % COLS) - 6, Math.floor(index / COLS) - 4)
  return { index, ms: Math.round(400 + distance * 60) }
})

// ---------- the clock hands (drawn in a 100 x 100 box, all turning about its centre) ----------
const HANDS = [
  { name: 'hour', length: 13.5 },
  { name: 'min', length: 20.5 },
  { name: 'sec', length: 26 },
]

// The opening sweep of the hands: a short wait, then one full turn onto the real time.
const SWEEP_DELAY_MS = 450
const SWEEP_MS = 1500

// The visitor's own local time, refreshed every second (for the big numbers).
function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return now
}

// The opening scene, modelled on a live-clock poster:
//  - it assembles in order: dot grid (a wave from the middle) -> dial -> hands -> numbers -> the "chrome" two seconds in;
//  - the hands run on animation frames, so they sweep instead of ticking, and they wake pointing up and roll one
//    full turn onto the real time;
//  - it answers the mouse (lib/clockPlay.js): three parallax planes, the dot under the pointer swells, and a hand can
//    be grabbed and turned (the numbers roll with it) before the clock springs back to the real time;
//  - the poster stays pinned while the site slides up over it like a sheet (1:1 with the scroll).
// Visitors who prefer reduced motion get the finished, still poster (the hands step once a second).
export default function Intro({ ready }) {
  const reduceMotion = useReducedMotion()
  const live = !reduceMotion
  const now = useNow()
  const { scrollY } = useScroll()

  // The poster is covered once the sheet has risen a full screen, plus its corner radius (the rounded corners keep
  // showing the poster until then): stop drawing it and take it out of the tab order.
  const isCovered = (y) => y >= window.innerHeight + sheetRadius()
  const [covered, setCovered] = useState(() => isCovered(window.scrollY))
  useMotionValueEvent(scrollY, 'change', (y) => setCovered(isCovered(y)))

  // Hand the corner radius to the stylesheet too: the Home anchor lands that far below the sheet's top edge (Hero.css).
  useEffect(() => {
    const update = () => document.documentElement.style.setProperty('--sheet-r', `${sheetRadius()}px`)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // The sheet's top edge sits `scrollY` px below the bottom of the screen: clip the poster to everything but the
  // sheet (see lib/sheet.js), so the page underneath (transparent) is never shown "through" the poster.
  const visible = (y) => Math.min(Math.max(y, 0), window.innerHeight)
  const risen = (y) => Math.min(Math.max(y, 0), window.innerHeight + sheetRadius())
  const clip = useTransform(scrollY, (y) => sheetClip(risen(y), sheetRadius()))
  const panY = useTransform(scrollY, (y) => -visible(y) * 0.3) // the poster drifts up slower than the sheet
  const panScale = useTransform(scrollY, (y) => 1 - 0.05 * (visible(y) / window.innerHeight))

  const handsRef = useRef({})
  const sweepStart = useRef(null)

  // What the pointer plays with (lib/clockPlay.js)
  const stageRef = useRef(null)
  const artRef = useRef(null)
  const dotsRef = useRef(null)
  const rowRefs = useRef([])
  const hourRef = useRef(null)
  const minuteRef = useRef(null)
  const playRef = useRef(null)
  const [grabbed, setGrabbed] = useState(false) // the hint goes away once a hand has been grabbed

  useEffect(() => {
    const play = createClockPlay({
      stage: stageRef.current,
      art: artRef.current,
      dots: dotsRef.current,
      cols: COLS,
      rows: ROWS,
      planes: { front: rowRefs.current, middle: dotsRef.current, deep: artRef.current },
      hands: handsRef.current,
      lengths: Object.fromEntries(HANDS.map(({ name, length }) => [name, length])),
      reduceMotion: Boolean(reduceMotion),
      onGrab: () => setGrabbed(true),
    })
    playRef.current = play
    return () => {
      play.destroy()
      playRef.current = null
    }
  }, [reduceMotion])

  // The hands run on animation frames from the visitor's local time, milliseconds included, so they sweep
  // smoothly instead of ticking. While somebody holds a hand (or the clock is springing back from it) the dial shows
  // the time that hand points to instead, and the big numbers follow it.
  useEffect(() => {
    if (!ready || covered) return undefined
    sweepStart.current ??= performance.now()
    let frame
    let last = performance.now()
    const write = (ref, text) => {
      if (ref.current && ref.current.textContent !== text) ref.current.textContent = text
    }
    const draw = (time) => {
      const dt = Math.min((time - last) / 1000, 0.05)
      last = time
      const { ms, playing, settled } = playRef.current?.frame(dt) ?? { ms: Date.now(), playing: false, settled: false }
      const date = new Date(ms)
      const seconds = date.getSeconds() + (reduceMotion ? 0 : date.getMilliseconds() / 1000)
      const minutes = date.getMinutes()
      const angles = {
        hour: ((date.getHours() % 12) + minutes / 60 + seconds / 3600) * 30,
        min: (minutes + seconds / 60) * 6,
        sec: seconds * 6,
      }
      // ease-out quartic: fast at first, landing softly on the real time
      const t = reduceMotion ? 1 : (time - sweepStart.current - SWEEP_DELAY_MS) / SWEEP_MS
      const progress = t <= 0 ? 0 : t >= 1 ? 1 : 1 - (1 - t) ** 4
      const drawn = {}
      for (const { name } of HANDS) {
        const shown = progress < 1 ? -360 + (angles[name] + 360) * progress : angles[name]
        drawn[name] = shown
        handsRef.current[name]?.setAttribute('transform', `rotate(${shown} 50 50)`)
      }
      playRef.current?.setAngles(drawn)
      playRef.current?.setInteractive(progress >= 1) // the hands cannot be grabbed while they are still sweeping in
      if (playing || settled) {
        write(hourRef, pad(date.getHours()))
        write(minuteRef, pad(date.getMinutes()))
      }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [ready, covered, reduceMotion])

  return (
    <section id="intro" className={`intro${ready || reduceMotion ? ' intro--go' : ''}`} aria-label="Introduction">
      <p className="sr-only">Scroll down to continue to the portfolio.</p>

      <motion.div
        ref={stageRef}
        className="intro__stage"
        style={{ clipPath: clip, visibility: covered ? 'hidden' : 'visible' }}
      >
        <motion.div className="intro__pan" style={live ? { y: panY, scale: panScale } : undefined}>
          <div className="intro__dots" ref={dotsRef} aria-hidden="true">
            {DOTS.map((dot) => (
              <i key={dot.index} style={{ '--d': `${dot.ms}ms` }} />
            ))}
          </div>

          <svg className="intro__art" ref={artRef} viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <radialGradient id="intro-soft" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#050506" />
                <stop offset="0.6" stopColor="#050506" />
                <stop offset="1" stopColor="#050506" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle className="intro__dial" cx="50" cy="50" r="50" fill="url(#intro-soft)" />
            <g className="intro__hands">
              {HANDS.map(({ name, length }) => (
                <g
                  key={name}
                  ref={(element) => {
                    handsRef.current[name] = element
                  }}
                  transform="rotate(0 50 50)"
                >
                  <line x1="50" y1="50" x2="50" y2={50 - length} />
                  <circle cx="50" cy={50 - length} r="1.05" />
                </g>
              ))}
              <circle cx="50" cy="50" r="1.3" />
            </g>
          </svg>

          <div
            className="intro__row intro__row--top"
            ref={(element) => {
              rowRefs.current[0] = element
            }}
            aria-hidden="true"
          >
            <span className="intro__digit" ref={hourRef}>
              {pad(now.getHours())}
            </span>
            <span className="intro__digit" ref={minuteRef}>
              {pad(now.getMinutes())}
            </span>
          </div>
          <div
            className="intro__row intro__row--bottom"
            ref={(element) => {
              rowRefs.current[1] = element
            }}
            aria-hidden="true"
          >
            <span className="intro__digit">{MONTHS[now.getMonth()]}</span>
            <span className="intro__digit">{pad(now.getDate())}</span>
          </div>
        </motion.div>

        <p className="intro__brand" aria-hidden="true">
          {brand}
        </p>
        <p className={`intro__hint${grabbed ? ' intro__hint--gone' : ''}`} aria-hidden="true">
          Grab a hand
        </p>
        <div className="intro__cue" aria-hidden="true" onClick={() => scrollToY(window.innerHeight + sheetRadius())}>
          <ArrowDown size={30} strokeWidth={2.2} />
        </div>
      </motion.div>
    </section>
  )
}
