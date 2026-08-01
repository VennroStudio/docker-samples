import axios, { type AxiosInstance } from 'axios'

export type ApiClientConfig = {
  baseURL: string
}

export function createApiClient({ baseURL }: ApiClientConfig) {
  return axios.create({
    baseURL,
    withCredentials: true,
  })
}

let configuredApiClient: AxiosInstance | null = null

export function configureApiClient(config: ApiClientConfig) {
  const client = createApiClient(config)
  configuredApiClient = client

  return () => {
    if (configuredApiClient === client) {
      configuredApiClient = null
    }
  }
}

export function getApiClient() {
  if (!configuredApiClient) {
    throw new Error('API client is not configured')
  }

  return configuredApiClient
}
