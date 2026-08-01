import { setupWebApp } from '@mono/app-runtime/setup'

import { APP_ENV } from '@/shared/config'

export function setupApp() {
  setupWebApp({ apiUrl: APP_ENV.VITE_API_URL })
}
