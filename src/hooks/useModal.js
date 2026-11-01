import { useEffect } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Behaviour shared by the site's dialogs: locks the background scroll, moves focus to the close button,
// closes on Escape, keeps Tab inside the panel, and hands focus back to whatever opened the dialog.
export default function useModal(panelRef, closeRef, onClose) {
  useEffect(() => {
    const previouslyFocused = document.activeElement
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden' // lock background scroll (scrollbar-gutter avoids layout shift)
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      // Keep keyboard focus inside the dialog.
      const items = [...panelRef.current.querySelectorAll(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      root.style.overflow = prevOverflow
      previouslyFocused?.focus?.()
    }
  }, [panelRef, closeRef, onClose])
}
