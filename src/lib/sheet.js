// The site is a sheet that slides up over the pinned opening poster, and its top corners are rounded with the poster
// showing in them (as on the reference). Nothing is drawn for the sheet itself, the page underneath is transparent:
// the poster is clipped to everything that is not the sheet. This file describes that shape.

const ARC_STEPS = 14

// The reference's radius: 64px on a 1920 x 1080 screen, scaled down with smaller ones (never below 24px).
export const sheetRadius = () =>
  Math.min(Math.max(64 * Math.min(window.innerWidth / 1920, window.innerHeight / 1080), 24), 64)

// An offset from the end (bottom or right) of the reference box.
const fromEnd = (offset) => `calc(100% ${offset < 0 ? '-' : '+'} ${Math.abs(offset).toFixed(2)}px)`

// The clip-path for a poster whose bottom `risen` px are covered by the sheet: the whole screen except a rectangle that
// has two rounded top corners (radius `r`) and whose top edge is `risen` px above the bottom of the screen.
export function sheetClip(risen, r) {
  if (risen <= 0) return 'none'
  const top = -risen // the sheet's top edge, as an offset from the bottom of the screen
  const points = ['0 0', '100% 0']
  // right corner, from the side edge up to the top edge
  for (let step = 0; step <= ARC_STEPS; step += 1) {
    const angle = (step / ARC_STEPS) * (Math.PI / 2)
    points.push(`${fromEnd(r * (Math.cos(angle) - 1))} ${fromEnd(top + r - r * Math.sin(angle))}`)
  }
  // left corner, from the top edge down to the side edge
  for (let step = 0; step <= ARC_STEPS; step += 1) {
    const angle = (step / ARC_STEPS) * (Math.PI / 2)
    points.push(`${(r - r * Math.sin(angle)).toFixed(2)}px ${fromEnd(top + r - r * Math.cos(angle))}`)
  }
  return `polygon(${points.join(',')})`
}
