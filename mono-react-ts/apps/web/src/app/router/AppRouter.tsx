import { Route, Routes } from 'react-router'

import { APP_ROUTES } from '@/shared/config'
import { HomePage } from '@/pages/home'

export function AppRouter() {
  return (
    <Routes>
      <Route
        element={<HomePage />}
        path={APP_ROUTES.home}
      />
    </Routes>
  )
}
