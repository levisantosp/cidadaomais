import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z.string().startsWith('postgresql://'),
  ORIGINS: z.url().array(),
  API_URL: z.url()
})

export const env = schema.parse({
  ...Bun.env,
  ORIGINS: Bun.env.ORIGINS?.split(',')
})
