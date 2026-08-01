import type { ReactNode } from 'react'

type AppLayoutProps = {
  appName: string
  children: ReactNode
}

export function AppLayout({ appName, children }: AppLayoutProps) {
  return (
    <main className="min-h-svh bg-neutral-950 text-white">
      <header className="border-b border-white/10 bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <a className="text-base font-semibold text-white" href="/">
            {appName}
          </a>
          <span className="rounded-md border border-white/10 px-3 py-1 text-sm text-white/55">
            admin
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4">{children}</div>
    </main>
  )
}
