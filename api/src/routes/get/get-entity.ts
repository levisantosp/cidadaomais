import { db, schema } from 'db'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../../plugins/auth-plugin'
import { NotFoundException } from '../../utils/HttpException'

export const getEntity = new Elysia().use(authPlugin).get(
  '/entities/:id',
  async (ctx) => {
    const [entity] = await db.select().from(schema.entity).where(eq(schema.entity.id, ctx.params.id)).limit(1)
    if (!entity) {
      throw new NotFoundException()
    }

    return entity
  },
  {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    })
  }
)