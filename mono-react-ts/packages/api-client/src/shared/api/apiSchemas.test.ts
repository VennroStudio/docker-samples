import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { parseApiResponse } from './apiSchemas'

describe('parseApiResponse', () => {
  it('returns parsed data from API envelope', () => {
    const data = parseApiResponse({ data: { id: 1 } }, z.object({ id: z.number() }))

    expect(data).toEqual({ id: 1 })
  })

  it('throws for invalid API envelope', () => {
    expect(() => parseApiResponse({ result: { id: 1 } }, z.object({ id: z.number() }))).toThrow()
  })
})
