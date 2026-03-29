import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '@/plugins/auth-plugin'

export const getEntitiy = new Elysia()
  .use(authPlugin)
  .get('/entities/:id', async (ctx) => {}, {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    })
  })
