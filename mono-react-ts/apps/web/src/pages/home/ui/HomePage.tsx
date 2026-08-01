import { ArrowRight } from 'lucide-react'

import { Button } from '@mono/ui/button'
import { Surface } from '@mono/ui/surface'

import { AppLayout } from '@/shared/ui/app-layout'

const stackItems = [
  'React 19',
  'TypeScript strict',
  'Vite',
  'Tailwind CSS',
  'React Query',
  'Turborepo',
]

export function HomePage() {
  return (
    <AppLayout appName="Mono Web">
      <section className="grid gap-8 py-10 md:grid-cols-[minmax(0,1fr)_320px] md:items-center md:py-16">
        <div className="grid gap-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            React + TypeScript monorepo
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
            Стартовый шаблон для нескольких фронтенд-приложений.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/68">
            Используй `apps/*` для приложений, `packages/*` для общих модулей и
            держи публичные entrypoints через package exports.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>
              Начать разработку
              <ArrowRight
                aria-hidden="true"
                className="size-4"
              />
            </Button>
            <Button variant="secondary">Открыть документацию</Button>
          </div>
        </div>

        <Surface as="aside" className="grid gap-3 p-5">
          <h2 className="text-base font-semibold text-white">Внутри шаблона</h2>
          <div className="grid gap-2">
            {stackItems.map((item) => (
              <div
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/72"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </Surface>
      </section>
    </AppLayout>
  )
}
