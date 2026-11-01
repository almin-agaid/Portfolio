import { useEffect, useState } from 'react'

// Returns the id of the section currently crossing the middle of the viewport.
// `ids` should be a stable (module-level) array.
export default function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!elements.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      // A thin band across the middle of the screen decides the active section.
      { rootMargin: '-45% 0px -50% 0px' },
    )
    elements.forEach((el) => observer.observe(el))

    // The last section can be shorter than half a screen, so it may never reach the
    // band; treat "scrolled to the very bottom" as the last section being active.
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) setActive(elements[elements.length - 1].id)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [ids])

  return active
}
