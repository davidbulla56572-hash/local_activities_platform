import { Navigate, Route, Routes } from 'react-router-dom'
import { AppControllerProvider } from './controllers/AppController'
import { ActivityDetailPage } from './ui/pages/ActivityDetailPage'
import { HomePage } from './ui/pages/HomePage'
import { RegistrationPage } from './ui/pages/RegistrationPage'
import { AppLayout } from './ui/shared/Layout'

export default function App() {
  return (
    <AppControllerProvider>
      <AppLayout>
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/detail" Component={ActivityDetailPage} />
          <Route path="/activities/:activityId" Component={ActivityDetailPage} />
          <Route path="/register" Component={RegistrationPage} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </AppControllerProvider>
  )
}
