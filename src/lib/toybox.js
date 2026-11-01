// The physics behind the "Play with my stack" box (components/ui/StackPlayground.jsx): the logo tiles fall in and can
// be grabbed, thrown and poked. The DOM does the drawing, so the tiles keep their CSS look; Matter.js only moves them.
// The loop sleeps as soon as everything has come to rest, so the box costs nothing while nobody is playing.

const STEP_MS = 1000 / 60
const MAX_SPEED = 32 // px per step: a hard fling is capped so a tile can never tunnel through a wall
const WALL = 240
const REST_FRAMES = 45 // this many calm frames in a row and the loop goes to sleep

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const random = (min, max) => min + Math.random() * (max - min)

// holders[i] is the positioned element of tile i, spins[i] the element inside it that turns.
export function createToybox(Matter, { box, holders, spins, reduceMotion }) {
  const { Engine, Bodies, Body, Composite, Constraint, Sleeping, Vector } = Matter

  const engine = Engine.create({ enableSleeping: true })
  engine.gravity.y = 1.1
  engine.positionIterations = 8
  engine.velocityIterations = 6
  const world = engine.world

  let width = box.clientWidth
  let height = box.clientHeight
  let size = holders[0].offsetWidth // the tile size comes from the CSS (--tile), so it can change per screen

  // A floor and two tall sides. There is no ceiling, so a tile thrown upwards just comes back down.
  let walls = []
  const buildWalls = () => {
    Composite.remove(world, walls)
    walls = [
      Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, { isStatic: true }),
      Bodies.rectangle(-WALL / 2, height / 2 - 1500, WALL, height + 3000, { isStatic: true }),
      Bodies.rectangle(width + WALL / 2, height / 2 - 1500, WALL, height + 3000, { isStatic: true }),
    ]
    Composite.add(world, walls)
  }
  buildWalls()

  // The tiles start in a column above the box, so they rain in one after another.
  const tiles = holders.map((_, index) => {
    const body = Bodies.rectangle(random(size, Math.max(size * 1.5, width - size)), -size * (1 + index * 1.35), size, size, {
      chamfer: { radius: size * 0.26 },
      angle: random(-0.7, 0.7),
      restitution: 0.3,
      friction: 0.5,
      frictionStatic: 0.8,
      frictionAir: 0.008,
      density: 0.0016,
      sleepThreshold: 50,
    })
    Body.setAngularVelocity(body, random(-0.08, 0.08))
    return body
  })
  Composite.add(world, tiles)

  let placed = false
  const render = () => {
    for (let index = 0; index < tiles.length; index += 1) {
      const { position, angle } = tiles[index]
      holders[index].style.transform = `translate3d(${(position.x - size / 2).toFixed(1)}px, ${(position.y - size / 2).toFixed(1)}px, 0)`
      spins[index].style.transform = `rotate(${angle.toFixed(3)}rad)`
    }
    if (!placed) {
      placed = true
      holders.forEach((holder) => holder.classList.add('is-placed'))
    }
  }

  // ---------- the loop ----------
  let frameId = 0
  let running = false
  let last = 0
  let accumulator = 0
  let restFrames = 0
  let dragging = null

  const stop = () => {
    running = false
    cancelAnimationFrame(frameId)
  }

  const frame = (time) => {
    frameId = requestAnimationFrame(frame)
    accumulator += Math.min(time - last, 50) // a long pause (another tab) must not become a burst of steps
    last = time
    while (accumulator >= STEP_MS) {
      Engine.update(engine, STEP_MS)
      accumulator -= STEP_MS
    }
    render()

    const calm = !dragging && tiles.every((body) => body.isSleeping || (body.speed < 0.2 && body.angularSpeed < 0.012))
    restFrames = calm ? restFrames + 1 : 0
    if (restFrames > REST_FRAMES) {
      tiles.forEach((body) => Sleeping.set(body, true))
      stop()
    }
  }

  const run = () => {
    if (running) return
    running = true
    restFrames = 0
    last = performance.now()
    frameId = requestAnimationFrame(frame)
  }

  // ---------- touching the tiles ----------
  const wake = (body) => Sleeping.set(body, false)
  const toBox = (event) => {
    const rect = box.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const poke = (body) => {
    wake(body)
    Body.setVelocity(body, { x: random(-4, 4), y: -random(9, 13) })
    Body.setAngularVelocity(body, random(-0.25, 0.25))
  }

  const shake = () => {
    for (const body of tiles) {
      wake(body)
      Body.setVelocity(body, { x: random(-9, 9), y: -random(8, 15) })
      Body.setAngularVelocity(body, random(-0.3, 0.3))
    }
    run()
  }

  // A tile is held by a spring between the pointer and the spot where it was grabbed, so it swings and lags like
  // something heavy, and letting go throws it with whatever speed it had.
  const onPointerDown = (event) => {
    if (dragging || (event.pointerType === 'mouse' && event.button !== 0)) return
    const holder = event.target.closest('[data-tile]')
    if (!holder) return
    const body = tiles[Number(holder.dataset.tile)]
    event.preventDefault()

    const point = toBox(event)
    wake(body)
    const constraint = Constraint.create({
      pointA: { x: point.x, y: point.y },
      bodyB: body,
      pointB: Vector.sub(point, body.position),
      stiffness: 0.2,
      damping: 0.1,
      length: 0,
    })
    Composite.add(world, constraint)

    dragging = { id: event.pointerId, constraint, body, holder, x: event.clientX, y: event.clientY, moved: false }
    box.setPointerCapture(event.pointerId)
    holder.classList.add('is-dragging')
    box.classList.add('is-grabbing')
    run()
  }

  const onPointerMove = (event) => {
    if (!dragging || event.pointerId !== dragging.id) return
    const point = toBox(event)
    // the hand stays inside the box, so a tile can never be pulled through a wall
    dragging.constraint.pointA.x = clamp(point.x, 0, width)
    dragging.constraint.pointA.y = clamp(point.y, -size, height)
    if (!dragging.moved && Math.hypot(event.clientX - dragging.x, event.clientY - dragging.y) > 6) dragging.moved = true
    wake(dragging.body)
  }

  const onPointerUp = (event) => {
    if (!dragging || event.pointerId !== dragging.id) return
    const { constraint, body, holder, moved } = dragging
    dragging = null
    Composite.remove(world, constraint)
    if (!moved) poke(body) // a click, not a drag

    const speed = Math.hypot(body.velocity.x, body.velocity.y)
    if (speed > MAX_SPEED) Body.setVelocity(body, Vector.mult(body.velocity, MAX_SPEED / speed))
    holder.classList.remove('is-dragging')
    box.classList.remove('is-grabbing')
    run()
  }

  box.addEventListener('pointerdown', onPointerDown)
  box.addEventListener('pointermove', onPointerMove)
  box.addEventListener('pointerup', onPointerUp)
  box.addEventListener('pointercancel', onPointerUp)

  // ---------- the box changes size (a window resize, a different screen) ----------
  const observer = new ResizeObserver(() => {
    const nextWidth = box.clientWidth
    const nextHeight = box.clientHeight
    const nextSize = holders[0].offsetWidth
    if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height && nextSize === size)) return

    if (nextSize !== size) {
      tiles.forEach((body) => Body.scale(body, nextSize / size, nextSize / size))
      size = nextSize
    }
    width = nextWidth
    height = nextHeight
    buildWalls()
    for (const body of tiles) {
      wake(body)
      Body.setPosition(body, {
        x: clamp(body.position.x, size / 2, width - size / 2),
        y: Math.min(body.position.y, height - size / 2),
      })
    }
    run()
  })
  observer.observe(box)

  // ---------- start ----------
  render()
  if (reduceMotion) {
    // No falling for visitors who prefer less motion: settle the pile off-screen and show it finished.
    for (let step = 0; step < 480; step += 1) Engine.update(engine, STEP_MS)
    render()
    tiles.forEach((body) => Sleeping.set(body, true))
  } else {
    run()
  }

  return {
    shake,
    destroy() {
      stop()
      observer.disconnect()
      box.removeEventListener('pointerdown', onPointerDown)
      box.removeEventListener('pointermove', onPointerMove)
      box.removeEventListener('pointerup', onPointerUp)
      box.removeEventListener('pointercancel', onPointerUp)
      Composite.clear(world, false)
      Engine.clear(engine)
    },
  }
}
