import { configureApiClient } from '@mono/api-client'

type SetupWebAppConfig = {
  apiUrl: string
}

export function setupWebApp({ apiUrl }: SetupWebAppConfig) {
  const cleanupApiClient = configureApiClient({ baseURL: apiUrl })

  return () => {
    cleanupApiClient()
  }
}
