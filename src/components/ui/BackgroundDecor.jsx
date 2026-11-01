// Fixed, non-interactive backdrop: a faint grid plus two slowly drifting colour glows.
// Pure CSS transforms (no filters), so it stays cheap on the compositor.
export default function BackgroundDecor() {
  return (
    <div className="bg-decor" aria-hidden="true">
      <div className="bg-decor__grid" />
      <div className="bg-decor__glow bg-decor__glow--one" />
      <div className="bg-decor__glow bg-decor__glow--two" />
    </div>
  )
}
