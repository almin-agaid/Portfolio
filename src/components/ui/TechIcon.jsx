import { techIcons } from './techIcons'

// Renders a registered logo as a single-colour SVG that takes its colour from CSS `color`.
// Wide logos can set a larger `size` in the registry; otherwise the tile's CSS size applies.
export default function TechIcon({ name }) {
  const icon = techIcons[name]
  if (!icon) return null

  return (
    <svg
      viewBox={icon.viewBox}
      fill="currentColor"
      style={icon.size ? { width: icon.size, height: icon.size } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <path d={icon.path} {...(icon.evenodd ? { fillRule: 'evenodd', clipRule: 'evenodd' } : {})} />
    </svg>
  )
}
