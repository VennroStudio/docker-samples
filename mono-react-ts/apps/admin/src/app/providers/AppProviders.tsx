import type { ReactNode } from 'react'

import { QueryProvider } from '@mono/app-runtime/query'
import { BrowserRouterProvider } from '@mono/app-runtime/router'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouterProvider>
      <QueryProvider>{children}</QueryProvider>
    </BrowserRouterProvider>
  )
}
