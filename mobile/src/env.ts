import { z } from 'zod'

const schema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
  EXPO_PUBLIC_ENABLE_API_DELAY: z.stringbool().optional()
})

export const env = schema.parse(process.env)