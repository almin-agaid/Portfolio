import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ResumeModal from '../components/ui/ResumeModal'

const ResumeContext = createContext({ openResume: () => {} })

// Any component can call useResume().openResume() to show the CV pop-up; the pop-up itself lives here, once.
export const useResume = () => useContext(ResumeContext)

export function ResumeProvider({ children }) {
  const [open, setOpen] = useState(false)
  const openResume = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])
  const value = useMemo(() => ({ openResume }), [openResume])

  return (
    <ResumeContext.Provider value={value}>
      {children}
      <AnimatePresence>{open && <ResumeModal key="resume" onClose={close} />}</AnimatePresence>
    </ResumeContext.Provider>
  )
}
