import { useCallback, useState } from 'react'

// Versioned (-v2) so a theme saved before the black/orange redesign does not carry over (keep in sync with index.html).
const STORAGE_KEY = 'portfolio-theme-v2'
const THEME_COLORS = { dark: '#1F2328', light: '#FFFAF6' }

// The initial theme is applied by an inline script in index.html (before first paint);
// this hook just mirrors it into React state and handles toggling.
export default function useTheme() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement

    // Briefly enable colour transitions so the switch fades instead of snapping.
    root.classList.add('theme-fade')
    window.setTimeout(() => root.classList.remove('theme-fade'), 400)

    root.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[next])
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage can be unavailable (private mode) - the toggle still works */
    }
    setTheme(next)
  }, [theme])

  return { theme, toggle }
}
