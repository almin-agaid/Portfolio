import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import './TerminalIntro.css'

const KEY_MS = 55 // delay between typed characters
const ANSWER_PAUSE_MS = 650 // pause after an answer appears, before the next command is typed
const START_DELAY_MS = 500 // pause between the card scrolling into view and the first keystroke

// The typing effect just steps through frames: one per keystroke, one when an answer appears,
// and a last one with every line done and an idle prompt.
function buildFrames(lines) {
  const frames = []
  lines.forEach((line, i) => {
    for (let c = 1; c <= line.command.length; c++) {
      frames.push({ done: i, typed: line.command.slice(0, c), answer: false, delay: KEY_MS })
    }
    frames.push({ done: i, typed: line.command, answer: true, delay: ANSWER_PAUSE_MS })
  })
  frames.push({ done: lines.length, typed: '', answer: false, delay: 0 })
  return frames
}

const IDLE = { done: 0, typed: '', answer: false }

// A small terminal that types out a few commands and their answers when it scrolls into view.
// Visitors who prefer reduced motion get the finished screen straight away.
export default function TerminalIntro({ title, lines }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduceMotion = useReducedMotion()
  const frames = useMemo(() => buildFrames(lines), [lines])
  const last = frames.length - 1
  const [index, setIndex] = useState(-1) // -1 = nothing typed yet

  useEffect(() => {
    if (!inView || reduceMotion || index >= last) return undefined
    const wait = index < 0 ? START_DELAY_MS : frames[index].delay
    const timer = window.setTimeout(() => setIndex((value) => value + 1), wait)
    return () => window.clearTimeout(timer)
  }, [inView, reduceMotion, index, last, frames])

  const frame = reduceMotion ? frames[last] : (frames[index] ?? IDLE)
  const answered = lines[frame.done]

  return (
    <figure ref={ref} className="terminal glow-border" aria-label="Terminal introduction">
      <div className="terminal__bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span className="terminal__title mono">{title}</span>
      </div>

      {/* The animated text is hidden from screen readers; they get the finished content below. */}
      <div className="terminal__body mono" aria-hidden="true" style={{ '--rows': lines.length * 2 + 1 }}>
        {lines.slice(0, frame.done).map((line) => (
          <div key={line.command}>
            <p>
              <span className="terminal__prompt">$</span> {line.command}
            </p>
            <p className="terminal__out">{line.output}</p>
          </div>
        ))}

        <p>
          <span className="terminal__prompt">$</span> {frame.typed}
          {!frame.answer && <span className="terminal__cursor" />}
        </p>
        {frame.answer && answered && <p className="terminal__out">{answered.output}</p>}
      </div>

      <figcaption className="sr-only">{lines.map((line) => `${line.command}: ${line.output}`).join('. ')}</figcaption>
    </figure>
  )
}
