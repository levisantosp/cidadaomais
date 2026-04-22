import { db, schema } from 'db'
import { desc } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../../plugins/auth-plugin'
import { paginatedResponse } from '../../utils/paginated-response'

export const getAuditLog = new Elysia().use(authPlugin).get(
  '/audit-log',
  async (ctx) => {
    const logs = await db
      .select()
      .from(schema.audit)
      .orderBy(desc(schema.audit.createdAt))
      .offset((ctx.query.page - 1) * ctx.query.limit)
      .limit(ctx.query.limit + 1)

    return paginatedResponse(logs, ctx.query)
  },
  {
    authorize: ['Administrator'],
    query: z.object({
      limit: z.coerce.number().int().min(1).max(100).optional().default(10),
      page: z.coerce.number().int().min(1).optional().default(1)
    })
  }
)
