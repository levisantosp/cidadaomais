import { Elysia } from 'elysia'
import { authPlugin } from '@/plugins/auth-plugin'
import {z} from 'zod'

export const getEntitiy = new Elysia()
  .use(authPlugin)
  .get('/entities/:id', async (ctx) => {}, {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    })
  })
