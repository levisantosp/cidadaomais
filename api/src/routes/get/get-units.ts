import { db, schema } from "db";
import { desc, ilike } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";
import { paginatedResponse } from "../../utils/paginated-response";

export const getUnits = new Elysia().get(
  "/units",
  async (ctx) => {
    const units = await db.query.entityUnit.findMany({
      where: ctx.query.name
        ? ilike(schema.entityUnit.name, `%${ctx.query.name}%`)
        : undefined,
      orderBy: desc(schema.entityUnit.createdAt),
      offset: (ctx.query.page - 1) * ctx.query.limit,
      limit: ctx.query.limit + 1,
      with: {
        entity: true
      }
    });

    return paginatedResponse(units, ctx.query);
  },
  {
    query: z.object({
      limit: z.coerce.number().int().min(1).max(100).optional().default(10),
      page: z.coerce.number().int().min(1).optional().default(1),
      name: z.string().optional()
    })
  }
);
