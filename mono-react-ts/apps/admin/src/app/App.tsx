import { useEffect } from 'react'

import { AppProviders } from './providers/AppProviders'
import { AppRouter } from './router/AppRouter'

export function App() {
  useEffect(() => {
    document.body.classList.remove('app-loading')
  }, [])

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
