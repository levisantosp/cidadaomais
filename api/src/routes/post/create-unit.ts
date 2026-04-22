import { db, schema } from 'db'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../../plugins/auth-plugin'

export const createUnit = new Elysia().use(authPlugin).post(
  '/units',
  async (ctx) => {
    const [unit] = await db
      .insert(schema.entityUnit)
      .values(ctx.body)
      .returning()

    return unit
  },
  {
    body: z.object({
      name: z.string().min(2).trim(),
      latitude: z.number(),
      longitude: z.number()
    })
  }
)
