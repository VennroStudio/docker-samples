import { Route, Routes } from 'react-router'

import { APP_ROUTES } from '@/shared/config'
import { DashboardPage } from '@/pages/dashboard'

export function AppRouter() {
  return (
    <Routes>
      <Route
        element={<DashboardPage />}
        path={APP_ROUTES.dashboard}
      />
    </Routes>
  )
}
