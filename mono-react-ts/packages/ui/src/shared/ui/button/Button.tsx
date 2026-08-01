import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@mono/ui/lib'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize | undefined
  variant?: ButtonVariant | undefined
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-white text-neutral-950 hover:bg-white/90',
  secondary: 'bg-surface-hover text-white hover:bg-white/15',
}

const buttonSizes: Record<ButtonSize, string> = {
  lg: 'h-12 px-5 text-base',
  md: 'h-10 px-4 text-sm',
}

export function Button({
  children,
  className,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60',
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
