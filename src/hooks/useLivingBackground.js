import { useEffect } from 'react'
import setGrain from '../lib/grain'

const HAS_MOUSE = '(hover: hover) and (pointer: fine)'

// Sets data-look on <html> (background.css keys off it) and, for 'living', lets the dot grid light up around the mouse.
// The pointer goes into CSS variables on the page background (--px / --py) and on a small light window that this adds to
// each alternate section (--bx / --by from that section's corner, and its size in --bw / --bh). The variables are on
// the window, not on the section, so the section's own background is not repainted while the mouse moves.
// Touch screens have no cursor, so they only get the static look.
export default function useLivingBackground(mode) {
  useEffect(() => {
    document.documentElement.dataset.look = mode
    if (mode === 'living' || mode === 'calm') setGrain()
    if (mode !== 'living' || !window.matchMedia(HAS_MOUSE).matches) return undefined

    const decor = document.querySelector('.bg-decor')
    const pageLight = decor?.querySelector('.bg-decor__light') // the page's light window
    const lights = new Map() // each alternate section and its light window
    for (const band of document.querySelectorAll('.section--alt')) {
      const light = document.createElement('div')
      light.className = 'band-light'
      light.setAttribute('aria-hidden', 'true')
      band.prepend(light)
      lights.set(band, light)
    }

    let pointer = null // the last pointer position, in client px
    let band = null // the alternate section the pointer is over
    let frame = 0

    const clearBand = () => {
      const light = band && lights.get(band)
      for (const name of ['--bx', '--by', '--bw', '--bh']) light?.style.removeProperty(name)
      band = null
    }

    const apply = () => {
      frame = 0
      if (!pointer) return
      if (pageLight && decor) {
        pageLight.style.setProperty('--px', `${pointer.x}px`)
        pageLight.style.setProperty('--py', `${pointer.y}px`)
        pageLight.style.setProperty('--pw', `${decor.clientWidth}px`)
        pageLight.style.setProperty('--ph', `${decor.clientHeight}px`)
      }

      const over = document.elementFromPoint(pointer.x, pointer.y)?.closest('.section--alt') ?? null
      if (over !== band) {
        clearBand()
        band = lights.has(over) ? over : null
      }
      const light = band && lights.get(band)
      if (light) {
        // the pointer from the section's corner, and the section's size (the lit dots must stay on the page's grid)
        const rect = band.getBoundingClientRect()
        light.style.setProperty('--bx', `${pointer.x - rect.left}px`)
        light.style.setProperty('--by', `${pointer.y - rect.top}px`)
        light.style.setProperty('--bw', `${rect.width}px`)
        light.style.setProperty('--bh', `${rect.height}px`)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onMove = (event) => {
      if (event.pointerType === 'touch') return
      pointer = { x: event.clientX, y: event.clientY }
      schedule()
    }
    const onLeave = () => {
      pointer = null
      for (const name of ['--px', '--py', '--pw', '--ph']) pageLight?.style.removeProperty(name)
      clearBand()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true }) // the page moves under a pointer that is not moving
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', schedule)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(frame)
      onLeave()
      for (const light of lights.values()) light.remove()
    }
  }, [mode])
}
