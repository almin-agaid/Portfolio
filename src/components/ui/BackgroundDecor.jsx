import './background.css'

// Fixed, non-interactive page background: a sparse grid of small dim dots on the black page (see .bg-decor in ui.css).
// With look.background = 'living' a small window of brighter, bigger dots follows the mouse (.bg-decor__light in
// background.css, moved by useLivingBackground).
export default function BackgroundDecor() {
  return (
    <div className="bg-decor" aria-hidden="true">
      <div className="bg-decor__light" />
    </div>
  )
}
