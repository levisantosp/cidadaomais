import { db, schema } from 'db'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../../plugins/auth-plugin'
import { NotFoundException } from '../../utils/HttpException'

export const deleteService = new Elysia().use(authPlugin).delete(
  '/services/:id',
  async (ctx) => {
    const [service] = await db
      .delete(schema.service)
      .where(eq(schema.service.id, ctx.params.id))
      .returning()
    if (!service) {
      throw new NotFoundException()
    }

    return service
  },
  {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    })
  }
)