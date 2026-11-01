import { useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { contact } from '../data/portfolioData'
import { sheetRadius } from '../lib/sheet'
import './HelloTab.css'

// The label is centred on the viewport and the site slides up over the opening poster from the bottom, so the sheet's
// top edge clears the top of the label after scrolling (viewport height + label height) / 2, and its rounded right
// corner (which still shows the poster) after one corner radius more.
const isPastPoster = (y, labelHeight) => y >= (window.innerHeight + labelHeight) / 2 + sheetRadius()

// A small vertical "HELLO!" on the right edge that links to the contact section. It is not part of the opening clock:
// it slides in once the visitor scrolls down and the site has covered the poster behind it, and leaves again when they
// scroll back up to the clock. Its text is `contact.helloTab` in the data file ('' hides it).
export default function HelloTab() {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const [shown, setShown] = useState(() => isPastPoster(window.scrollY, 0))
  useMotionValueEvent(scrollY, 'change', (y) => setShown(isPastPoster(y, ref.current?.offsetHeight ?? 0)))

  if (!contact.helloTab) return null

  return (
    <a
      ref={ref}
      href="#contact"
      className={`hello-tab${shown ? ' hello-tab--shown' : ''}`}
      aria-label="Say hello: go to the contact section"
    >
      <span aria-hidden="true">{contact.helloTab}</span>
    </a>
  )
}
