import { db, schema } from 'db'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../../plugins/auth-plugin'
import { NotFoundException } from '../../utils/HttpException'

export const deleteUnit = new Elysia().use(authPlugin).delete(
  '/units/:id',
  async (ctx) => {
    const [unit] = await db
      .delete(schema.entityUnit)
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
    })
  }
)
