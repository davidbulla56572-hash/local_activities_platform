import { createContext, useContext, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLocalActivities } from '../application/hooks/useLocalActivities'
import type { AppRoute } from '../domain/models'


const STATIC_ROUTES: Record<string, AppRoute> = {
  '/': { name: 'home' },
  '/detail': { name: 'detail' },
  '/register': { name: 'register' },
}

function parseRoute(pathname: string): AppRoute {
  const staticRoute = STATIC_ROUTES[pathname]
  if (staticRoute) {
    return staticRoute
  }

  const activitySegments = pathname.split('/')
  if (activitySegments.length === 3 && activitySegments[1] === 'activities' && activitySegments[2]) {
    return { name: 'activity', activityId: activitySegments[2] }
  }

  return { name: 'home' }
}

const AppControllerContext = createContext<ReturnType<typeof useLocalActivities> | null>(null)

export function AppControllerProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

  const route = parseRoute(location.pathname)
  const controller = useLocalActivities(route, navigate)

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
