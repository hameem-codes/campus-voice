import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional().default('postgresql://mock:mock@localhost:5432/mock'),
  DIRECT_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(16).default('cv-default-session-secret-at-least-16-bytes'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
})

export type Env = z.infer<typeof envSchema>

let validatedEnv: Env | null = null

export function getEnv(): Env {
  if (validatedEnv) return validatedEnv

  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  })

  if (!parsed.success) {
    console.error('Environment validation error:', parsed.error.format())
    throw new Error('Invalid environment variables configuration')
  }

  validatedEnv = parsed.data
  return validatedEnv
}
