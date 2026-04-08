import { db, schema } from "db";
import { desc } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../plugins/auth-plugin";

export const getAuditLog = new Elysia().use(authPlugin).get(
  "/audit-log",
  async (ctx) => {
    const logs = await db
      .select()
      .from(schema.category)
      .orderBy(desc(schema.category.createdAt))
      .offset((ctx.query.page - 1) * ctx.query.limit)
      .limit(ctx.query.limit + 1);

    return {
      page: ctx.query.page,
      hasNextPage: logs.length > ctx.query.limit,
      logs: logs.slice(0, ctx.query.limit)
    };
  },
  {
    authorize: ["Administrator"],
    query: z.object({
      limit: z.coerce.number().int().min(1).max(100).optional().default(10),
      page: z.coerce.number().int().min(1).optional().default(1)
    })
  }
);
