import { AppControllerProvider } from './controllers/AppController'
import { ActivityDetailPage } from './ui/pages/ActivityDetailPage'
import { HomePage } from './ui/pages/HomePage'
import { RegistrationPage } from './ui/pages/RegistrationPage'
import { AppLayout } from './ui/shared/Layout'
import { useAppController } from './application/hooks/useAppController'

function AppRouter() {
  const { route } = useAppController()

  if (route.name === 'activity' || route.name === 'detail') {
    return <ActivityDetailPage />
  }

  if (route.name === 'register') {
    return <RegistrationPage />
  }

  return <HomePage />
}

export default function App() {
  return (
    <AppControllerProvider>
      <AppLayout>
        <AppRouter />
      </AppLayout>
    </AppControllerProvider>
  )
}
