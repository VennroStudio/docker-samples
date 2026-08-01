import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router'

type BrowserRouterProviderProps = {
  children: ReactNode
}

export function BrowserRouterProvider({
  children,
}: BrowserRouterProviderProps) {
  return <BrowserRouter>{children}</BrowserRouter>
}
