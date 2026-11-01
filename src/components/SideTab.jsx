import { useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { profile } from '../data/portfolioData'
import './SideTab.css'

const initials = profile.name
  .split(/\s+/)
  .map((word) => word[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()

// The tab sits from 38% of the screen down, and the site slides up over the opening poster from the bottom, so the
// poster is behind the whole tab until the scroll passes 62% of a screen minus the tab's own height.
const isOnPoster = (y, tabHeight) => y < window.innerHeight * 0.62 - tabHeight

// The "MA. / Portfolio" tab on the left edge. It arrives with the opening poster and then stays put on every section
// (the same fixed tab, not a copy per section). On windows too narrow to leave it room beside the content it stays with
// the poster only (see SideTab.css). The initials come from `profile.name`.
export default function SideTab({ ready }) {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const [onPoster, setOnPoster] = useState(() => isOnPoster(window.scrollY, 0))
  useMotionValueEvent(scrollY, 'change', (y) => setOnPoster(isOnPoster(y, ref.current?.offsetHeight ?? 0)))

  return (
    <div
      ref={ref}
      className={`side-tab${ready ? ' side-tab--go' : ''}${onPoster ? ' side-tab--poster' : ''}`}
      aria-hidden="true"
    >
      <span>{initials}.</span>
      <span className="side-tab__label">Portfolio</span>
    </div>
  )
}
