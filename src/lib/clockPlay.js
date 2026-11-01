// Playing with the opening clock. These are the interactions the reference poster has (minus its sound):
//  - parallax: the big numbers, the dot grid and the dial sit on three planes that drift against the pointer;
//  - the dot nearest the pointer swells as you glide over the grid;
//  - the scratch: grab a hand and it follows your pointer like a jog wheel, the numbers roll with it, and when you let
//    go the clock springs back to the real time.
// Mouse and pen only: on a touch screen a finger on the poster has to keep scrolling the page.

// How far each plane travels per px of pointer offset from the screen's centre (the reference's own numbers);
// wide screens travel further, so the planes separate more.
const PLANE = { front: -0.016, middle: -0.007, deep: -0.0028 }
const WIDE_BOOST = 1.9
const EASE_PER_FRAME = 0.06

// How much clock time one degree of each hand is, in ms: the second hand turns 6 degrees a second, the minute hand
// 6 a minute, the hour hand 30 an hour.
const MS_PER_DEGREE = { sec: 1000 / 6, min: 10000, hour: 120000 }

const SPRING = { omega: 11, zeta: 0.75 } // letting go: a slightly under-damped spring back to the real time
const HIT_PX = 15 // how close the pointer has to be to a hand to grab it
const SWELL_MIN_PX = 16

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

// planes: { front: [elements], middle: element, deep: element }; hands: { hour, min, sec } SVG groups;
// lengths: each hand's length in the dial's 100-unit box.
export function createClockPlay({ stage, art, dots, cols, rows, planes, hands, lengths, reduceMotion, onGrab }) {
  const pointer = { tx: 0, ty: 0, x: 0, y: 0 }
  let angles = { hour: 0, min: 0, sec: 0 }
  let interactive = false
  let held = null // { hand, id, prev, delta, startMs, velocity, at }: the hand in your grip
  let spring = null // { x, v }: how far (in seconds) the clock is from real time after letting go, and how fast it moves
  let wasPlaying = false
  let hotHand = null
  let hotDot = -1

  // ---------- the dial, in screen px ----------
  const dial = () => {
    const rect = art.getBoundingClientRect()
    return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2, unit: rect.width / 100 }
  }
  // 0 at twelve o'clock, growing clockwise
  const angleOf = (x, y) => {
    const { cx, cy } = dial()
    return (Math.atan2(x - cx, -(y - cy)) * 180) / Math.PI
  }

  // The hand under the pointer: its outer part, so the three hands do not fight over the hub.
  const pickHand = (x, y) => {
    const { cx, cy, unit } = dial()
    let best = null
    let bestGap = HIT_PX
    for (const name of Object.keys(lengths)) {
      const angle = (angles[name] * Math.PI) / 180
      const dx = Math.sin(angle)
      const dy = -Math.cos(angle)
      const length = lengths[name] * unit
      const reach = clamp((x - cx) * dx + (y - cy) * dy, length * 0.3, length)
      const gap = Math.hypot(x - cx - dx * reach, y - cy - dy * reach)
      if (gap < bestGap) {
        best = name
        bestGap = gap
      }
    }
    return best
  }

  const light = (name, grip = false) => {
    if (name === hotHand && !grip) return
    hotHand = name
    for (const key of Object.keys(hands)) {
      hands[key].classList.toggle('is-hot', key === name && !grip)
      hands[key].classList.toggle('is-held', key === name && grip)
    }
  }

  // ---------- the dot grid ----------
  // The dot under the pointer, if it is close enough to one (the grid's on-screen pitch is measured from two dots, so it
  // already includes the poster's scroll scale and parallax).
  const nearestDot = (x, y) => {
    const first = dots.children[0]
    const second = dots.children[1]
    if (!first || !second) return -1
    const a = first.getBoundingClientRect()
    const b = second.getBoundingClientRect()
    const originX = a.left + a.width / 2
    const originY = a.top + a.height / 2
    const pitch = b.left + b.width / 2 - originX
    if (pitch < 8) return -1
    const i = Math.round((x - originX) / pitch)
    const j = Math.round((y - originY) / pitch)
    if (i < 0 || i >= cols || j < 0 || j >= rows) return -1
    return Math.hypot(x - (originX + i * pitch), y - (originY + j * pitch)) < Math.max(SWELL_MIN_PX, pitch * 0.22)
      ? j * cols + i
      : -1
  }

  const swell = (index) => {
    if (index === hotDot) return
    dots.children[hotDot]?.classList.remove('is-hot')
    dots.children[index]?.classList.add('is-hot')
    hotDot = index
  }

  // ---------- the pointer on the poster ----------
  const shownMs = () => {
    if (held) return held.startMs + held.delta * MS_PER_DEGREE[held.hand]
    if (spring) return Date.now() + spring.x * 1000
    return Date.now()
  }

  const onDown = (event) => {
    if (event.pointerType === 'touch' || event.button !== 0 || !interactive) return
    const hand = pickHand(event.clientX, event.clientY)
    if (!hand) return
    event.preventDefault()
    held = {
      hand,
      id: event.pointerId,
      prev: angleOf(event.clientX, event.clientY),
      delta: 0, // degrees turned since the grab, counted across full turns
      startMs: shownMs(), // the clock time at the grab (the clock is held still while you hold a hand)
      velocity: 0,
      at: performance.now(),
    }
    spring = null
    stage.setPointerCapture(event.pointerId)
    stage.style.cursor = 'grabbing'
    swell(-1)
    light(hand, true)
    onGrab?.()
  }

  const onMove = (event) => {
    if (event.pointerType === 'touch') return
    if (held) {
      if (event.pointerId !== held.id) return
      // The hand keeps the grip it was grabbed with: it turns by how far the pointer turned, it never jumps under it.
      const angle = angleOf(event.clientX, event.clientY)
      let turn = angle - held.prev
      if (turn > 180) turn -= 360
      else if (turn <= -180) turn += 360
      held.prev = angle
      held.delta += turn
      const now = performance.now()
      held.velocity += (turn / Math.max((now - held.at) / 1000, 0.001) - held.velocity) * 0.35 // deg/s, smoothed
      held.at = now
      return
    }
    // Hovering: a hand lights up and shows an open hand; anywhere else the dot under the pointer swells.
    const hand = interactive ? pickHand(event.clientX, event.clientY) : null
    light(hand)
    stage.style.cursor = hand ? 'grab' : ''
    swell(hand ? -1 : nearestDot(event.clientX, event.clientY))
  }

  const onUp = (event) => {
    if (!held || event.pointerId !== held.id) return
    const { hand, delta, startMs, velocity, at } = held
    held = null
    stage.style.cursor = ''
    light(null)
    // a flick keeps its speed into the spring; a pause before letting go does not
    const flick = performance.now() - at > 80 ? 0 : velocity
    spring = reduceMotion
      ? null
      : { x: (startMs + delta * MS_PER_DEGREE[hand] - Date.now()) / 1000, v: (flick * MS_PER_DEGREE[hand]) / 1000 }
  }

  const onLeave = () => {
    if (held) return
    light(null)
    swell(-1)
    stage.style.cursor = ''
  }

  // ---------- parallax follows the pointer anywhere on the page ----------
  const onWindowMove = (event) => {
    if (event.pointerType === 'touch' || reduceMotion) return
    pointer.tx = event.clientX - window.innerWidth / 2
    pointer.ty = event.clientY - window.innerHeight / 2
  }
  const onWindowLeave = () => {
    pointer.tx = 0
    pointer.ty = 0
  }

  const shift = (target, factor) => {
    const move = `translate3d(${(pointer.x * factor).toFixed(2)}px, ${(pointer.y * factor).toFixed(2)}px, 0)`
    if (Array.isArray(target)) target.forEach((element) => (element.style.transform = move))
    else target.style.transform = move
  }

  stage.addEventListener('pointerdown', onDown)
  stage.addEventListener('pointermove', onMove)
  stage.addEventListener('pointerup', onUp)
  stage.addEventListener('pointercancel', onUp)
  stage.addEventListener('lostpointercapture', onUp) // however the grip ends, the hand is let go
  stage.addEventListener('pointerleave', onLeave)
  window.addEventListener('pointermove', onWindowMove, { passive: true })
  document.documentElement.addEventListener('mouseleave', onWindowLeave)

  return {
    setInteractive(value) {
      interactive = value
    },
    setAngles(next) {
      angles = next
    },

    // Called every frame by the clock's loop. Returns the moment the dial should show (epoch ms), whether somebody is
    // playing with it, and `settled` once, on the frame it is back on real time (so the caller can restore the numbers).
    frame(dt) {
      if (!reduceMotion) {
        const ease = 1 - (1 - EASE_PER_FRAME) ** (dt * 60)
        pointer.x += (pointer.tx - pointer.x) * ease
        pointer.y += (pointer.ty - pointer.y) * ease
        const boost = window.innerWidth >= 1024 ? WIDE_BOOST : 1
        shift(planes.front, PLANE.front * boost)
        shift(planes.middle, PLANE.middle * boost)
        shift(planes.deep, PLANE.deep * boost)
      }

      let playing = false
      if (held) {
        playing = true
      } else if (spring) {
        const step = Math.min(dt, 0.05)
        spring.v += (-SPRING.omega * SPRING.omega * spring.x - 2 * SPRING.zeta * SPRING.omega * spring.v) * step
        spring.x += spring.v * step
        if (Math.abs(spring.x) < 0.03 && Math.abs(spring.v) < 0.3) spring = null
        else playing = true
      }
      const settled = wasPlaying && !playing
      wasPlaying = playing
      return { ms: shownMs(), playing, settled }
    },

    destroy() {
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
      stage.removeEventListener('lostpointercapture', onUp)
      stage.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointermove', onWindowMove)
      document.documentElement.removeEventListener('mouseleave', onWindowLeave)
      light(null)
      swell(-1)
      stage.style.cursor = ''
      ;[...planes.front, planes.middle, planes.deep].forEach((element) => (element.style.transform = ''))
    },
  }
}
