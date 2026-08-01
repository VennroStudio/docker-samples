import { QueryClient } from '@tanstack/react-query'

const ONE_MINUTE = 60_000

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: ONE_MINUTE,
      },
    },
  })
}

export const queryClient = createQueryClient()
