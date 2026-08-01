// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Button } from './Button'

afterEach(() => {
  cleanup()
})

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy()
  })

  it('uses button type by default', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' }).getAttribute('type')).toBe('button')
  })
})
