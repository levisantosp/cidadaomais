import { db, schema } from "db"
import { eq } from "drizzle-orm"
import { Elysia } from "elysia"
import { z } from "zod"
import { authPlugin } from "@/plugins/auth-plugin"
import { NotFoundException } from "@/utils/HttpException"

export const editEntity = new Elysia().use(authPlugin).put(
  "/entities/:id",
  async (ctx) => {
    const [entity] = await db
      .update(schema.entity)
      .set(ctx.body)
      .where(eq(schema.entity.id, ctx.params.id))
      .returning()
    if (!entity) {
      throw new NotFoundException()
    }

    return entity
  },
  {
    authorize: ["Administrator"],
    params: z.object({
      id: z.coerce.bigint()
    }),
    body: z.object({
      name: z.string().min(2).optional()
    })
  }
)
