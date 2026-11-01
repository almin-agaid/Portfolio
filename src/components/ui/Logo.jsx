import { motion } from 'framer-motion'

// The "</>" mark. With `draw`, each stroke is drawn in sequence (used by the loader).
const strokes = [
  { d: 'M25 21 14 32l11 11', color: 'var(--accent)', width: 5 },
  { d: 'm39 21 11 11-11 11', color: 'var(--accent-2)', width: 5 },
  { d: 'M35 17 29 47', color: 'var(--text)', width: 4 },
]

export default function LogoMark({ draw = false, size = 34, className = '' }) {
  return (
    <svg
      className={`logo-mark ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {!draw && <rect x="1" y="1" width="62" height="62" rx="15" className="logo-mark__tile" />}
      {strokes.map((s, i) => {
        const shared = {
          d: s.d,
          stroke: s.color,
          strokeWidth: s.width,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }
        return draw ? (
          <motion.path
            key={s.d}
            {...shared}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.1 + i * 0.22, ease: 'easeOut' }}
          />
        ) : (
          <path key={s.d} {...shared} />
        )
      })}
    </svg>
  )
}
