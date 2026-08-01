import type { ReactNode } from 'react'
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'

import { queryClient } from './queryClient'

type QueryProviderProps = {
  children: ReactNode
  client?: QueryClient | undefined
}

export function QueryProvider({
  children,
  client = queryClient,
}: QueryProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
