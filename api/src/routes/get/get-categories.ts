import { db, schema } from 'db'
import { desc, ilike } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { paginatedResponse } from '../../utils/paginated-response'

export const getCategories = new Elysia().get(
  '/categories',
  async (ctx) => {
    const categories = await db
      .select()
      .from(schema.category)
      .where(ctx.query.name ? ilike(schema.category.name, `%${ctx.query.name}%`) : undefined)
      .orderBy(desc(schema.category.createdAt))
      .offset((ctx.query.page - 1) * ctx.query.limit)
      .limit(ctx.query.limit + 1)

    return paginatedResponse(categories, ctx.query)
  },
  {
    query: z.object({
      name: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(100).optional().default(10),
      page: z.coerce.number().int().min(1).optional().default(1)
    })
  }
)