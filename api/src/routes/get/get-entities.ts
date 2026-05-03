import { db, schema } from 'db'
import { desc } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { paginatedResponse } from '../../utils/paginated-response'

export const getEntities = new Elysia().get(
  '/entities',
  async (ctx) => {
    const entities = await db
      .select()
      .from(schema.entity)
      .orderBy(desc(schema.entity.createdAt))
      .offset((ctx.query.page - 1) * ctx.query.limit)
      .limit(ctx.query.limit + 1)

    return paginatedResponse(entities, ctx.query)
  },
  {
    query: z.object({
      limit: z.coerce.number().int().min(1).max(100).optional().default(10),
      page: z.coerce.number().int().min(1).optional().default(1)
    })
  }
)