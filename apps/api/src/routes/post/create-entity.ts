import { Elysia } from 'elysia'
import { authPlugin } from '@/plugins/auth-plugin'
import {z} from 'zod'

export const createEntity = new Elysia()
  .use(authPlugin)
  .post('/entities', async (ctx) => {}, {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    })
  })
