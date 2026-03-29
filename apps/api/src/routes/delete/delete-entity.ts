import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '@/plugins/auth-plugin'

export const deleteEntity = new Elysia()
  .use(authPlugin)
  .delete('/entities/:id', async (ctx) => {}, {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    })
  })
