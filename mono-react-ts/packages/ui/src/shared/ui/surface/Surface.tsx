import type { HTMLAttributes } from 'react'

import { cn } from '@mono/ui/lib'

type SurfaceElement = 'article' | 'aside' | 'div' | 'section'

type SurfaceProps = HTMLAttributes<HTMLElement> & {
  as?: SurfaceElement
}

export function Surface({
  as: Component = 'div',
  className,
  ...props
}: SurfaceProps) {
  return (
    <Component
      className={cn('rounded-lg border border-white/10 bg-surface', className)}
      {...props}
    />
  )
}
