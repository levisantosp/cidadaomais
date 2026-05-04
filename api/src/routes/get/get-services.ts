import { db, schema } from 'db'
import { desc, ilike } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { paginatedResponse } from '../../utils/paginated-response'

export const getServices = new Elysia().get(
  '/services',
  async (ctx) => {
    const services = await db.query.service.findMany({
      where: ctx.query.name ? ilike(schema.service.name, `%${ctx.query.name}%`) : undefined,
      orderBy: desc(schema.service.createdAt),
      offset: (ctx.query.page - 1) * ctx.query.limit,
      limit: ctx.query.limit + 1,
      with: {
        category: true
      }
    })

    return paginatedResponse(services, ctx.query)
  },
  {
    query: z.object({
      limit: z.coerce.number().int().min(1).max(100).optional().default(10),
      page: z.coerce.number().int().min(1).optional().default(1),
      name: z.string().optional()
    })
  }
)
