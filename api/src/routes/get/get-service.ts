import { db, schema } from 'db'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { NotFoundException } from '../../utils/HttpException'

export const getService = new Elysia().get(
  '/services/:id',
  async (ctx) => {
    const service = await db.query.service.findFirst({
      where: eq(schema.service.id, ctx.params.id),
      with: {
        category: true
      }
    })
    if (!service) {
      throw new NotFoundException()
    }

    return service
  },
  {
    params: z.object({
      id: z.coerce.bigint()
    })
  }
)
