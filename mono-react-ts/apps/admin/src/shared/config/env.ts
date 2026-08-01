import { z } from 'zod'

const appEnvSchema = z.object({
  VITE_API_URL: z.string().url(),
})

export const APP_ENV = appEnvSchema.parse(import.meta.env)
