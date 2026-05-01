import { db, schema } from 'db'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../../plugins/auth-plugin'

export const deleteEntity = new Elysia().use(authPlugin).delete(
  '/entities/:id',
  async (ctx) => {
    const [entity] = await db.delete(schema.entity).where(eq(schema.entity.id, ctx.params.id)).returning()

    return entity
  },
  {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    })
  }
)