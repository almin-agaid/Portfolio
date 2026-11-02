// The fine grain on the panels (background.css). A tiny tile of faint random speckle is drawn once into a canvas and
// handed to the stylesheet as an image. (An SVG noise filter looks the same, but it is re-rendered from scratch every
// time the panel repaints, which made moving the mouse over a panel several times slower than a plain bitmap does.)

const SIZE = 128
let done = false

// ink: 255 for white specks (the dark theme), 0 for dark specks (the light theme); strength: the brightest speck's alpha
const tile = (ink, strength) => {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const context = canvas.getContext('2d')
  if (!context) return null
  const image = context.createImageData(SIZE, SIZE)
  for (let index = 0; index < image.data.length; index += 4) {
    image.data[index] = ink
    image.data[index + 1] = ink
    image.data[index + 2] = ink
    image.data[index + 3] = Math.random() ** 2 * strength // squared: mostly faint, a few brighter specks, like film
  }
  context.putImageData(image, 0, 0)
  return `url(${canvas.toDataURL('image/png')})`
}

export default function setGrain() {
  if (done) return
  done = true
  const root = document.documentElement.style
  const white = tile(255, 18)
  const dark = tile(0, 12)
  if (white) root.setProperty('--grain-white', white)
  if (dark) root.setProperty('--grain-dark', dark)
}
