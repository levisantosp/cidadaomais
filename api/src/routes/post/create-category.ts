import { db, schema } from "db";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../plugins/auth-plugin";

export const createCategory = new Elysia().use(authPlugin).post(
  "/categories",
  async (ctx) => {
    const [category] = await db
      .insert(schema.category)
      .values(ctx.body)
      .returning();

    return category;
  },
  {
    authorize: ["Administrator"],
    body: z.object({
      name: z.string().min(2).trim()
    })
  }
);
