import { describe, expect, it } from 'vitest'

import { configureApiClient, createApiClient, getApiClient } from './apiClient'

describe('api client', () => {
  it('creates an axios client with base URL and credentials', () => {
    const client = createApiClient({ baseURL: 'https://api.example.test/v1' })

    expect(client.defaults.baseURL).toBe('https://api.example.test/v1')
    expect(client.defaults.withCredentials).toBe(true)
  })

  it('exposes a configured singleton until cleanup', () => {
    const cleanup = configureApiClient({ baseURL: 'https://api.example.test/v1' })

    expect(getApiClient().defaults.baseURL).toBe('https://api.example.test/v1')
    cleanup()
    expect(() => getApiClient()).toThrow('API client is not configured')
  })
})
