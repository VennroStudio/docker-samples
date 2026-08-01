import { Activity, Database, ShieldCheck } from 'lucide-react'

import { Surface } from '@mono/ui/surface'

import { AppLayout } from '@/shared/ui/app-layout'

const cards = [
  {
    icon: Activity,
    label: 'Состояние',
    value: 'Готово',
  },
  {
    icon: Database,
    label: 'API URL',
    value: import.meta.env.VITE_API_URL,
  },
  {
    icon: ShieldCheck,
    label: 'Проверки',
    value: 'typecheck + lint + test',
  },
]

export function DashboardPage() {
  return (
    <AppLayout appName="Mono Admin">
      <section className="grid gap-6 py-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Admin workspace
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-white">
            Панель управления
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map(({ icon: Icon, label, value }) => (
            <Surface className="grid gap-4 p-5" key={label}>
              <Icon
                aria-hidden="true"
                className="size-6 text-accent"
              />
              <div>
                <p className="text-sm text-white/50">{label}</p>
                <p className="mt-1 break-words text-lg font-semibold text-white">
                  {value}
                </p>
              </div>
            </Surface>
          ))}
        </div>
      </section>
    </AppLayout>
  )
}
