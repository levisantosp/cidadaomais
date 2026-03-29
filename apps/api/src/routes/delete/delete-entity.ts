import { Elysia } from 'elysia'
import { authPlugin } from '@/plugins/auth-plugin'
import {z} from 'zod'

export const deleteEntity = new Elysia()
  .use(authPlugin)
  .delete('/entities/:id', async (ctx) => {}, {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    })
  })
