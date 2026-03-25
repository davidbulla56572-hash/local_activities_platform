import { createContext, useContext, type ReactNode } from 'react'
import { useLocalActivities } from '../application/hooks/useLocalActivities'

const AppControllerContext = createContext<ReturnType<typeof useLocalActivities> | null>(null)

export function AppControllerProvider({ children }: { children: ReactNode }) {
  const controller = useLocalActivities()

  return (
    <AppControllerContext.Provider value={controller}>
      {children}
    </AppControllerContext.Provider>
  )
}

export function useAppControllerContext() {
  const context = useContext(AppControllerContext)

  if (!context) {
    throw new Error('AppControllerProvider must wrap the application.')
  }

  return context
}
