import { createAuthClient } from 'better-auth/vue'
import { env } from '~/env'

export const auth = createAuthClient({
  basePath: '/auth',
  baseURL: env.VITE_API_URL
})
