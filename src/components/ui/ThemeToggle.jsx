import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import useTheme from '../../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  const Icon = isDark ? Sun : Moon

  return (
    <motion.button
      type="button"
      className="icon-btn"
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className="icon-btn__swap"
          initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
          transition={{ duration: 0.18 }}
        >
          <Icon size={19} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
