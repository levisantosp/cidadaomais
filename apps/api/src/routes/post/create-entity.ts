import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '@/plugins/auth-plugin'

export const createEntity = new Elysia()
  .use(authPlugin)
  .post('/entities', async (ctx) => {}, {
    authorize: ['Administrator'],
    body: z.object({
      name: z.string().min(2)
    })
  })
