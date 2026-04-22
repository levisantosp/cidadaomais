import { db, schema } from 'db'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../../plugins/auth-plugin'
import { NotFoundException } from '../../utils/HttpException'

export const editUnit = new Elysia().use(authPlugin).put(
  '/units/:id',
  async (ctx) => {
    const [unit] = await db
      .update(schema.entityUnit)
      .set(ctx.body)
      .where(eq(schema.entityUnit.id, ctx.params.id))
      .returning()
    if (!unit) {
      throw new NotFoundException()
    }

    return unit
  },
  {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    }),
    body: z.object({
      name: z.string().min(2).trim().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional()
    })
  }
)
