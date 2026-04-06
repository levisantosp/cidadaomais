import { db, schema } from "db"
import { Elysia } from "elysia"
import { z } from "zod"
import { authPlugin } from "../../plugins/auth-plugin"

export const createEntity = new Elysia().use(authPlugin).post(
  "/entities",
  async (ctx) => {
    const [entity] = await db.insert(schema.entity).values(ctx.body).returning()
    return entity
  },
  {
    authorize: ["Administrator"],
    body: z.object({
      name: z.string().min(2)
    })
  }
)
