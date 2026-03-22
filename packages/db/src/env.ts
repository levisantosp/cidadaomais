import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z.string().startsWith('postgresql://'),
  MACHINE_ID: z.coerce.bigint().min(0n)
})

export const env = schema.parse(process.env)
