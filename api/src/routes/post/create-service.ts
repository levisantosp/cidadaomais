import { db, schema } from "db";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../plugins/auth-plugin";

export const createService = new Elysia().use(authPlugin).post(
  "/services",
  async (ctx) => {
    const [service] = await db
      .insert(schema.service)
      .values(ctx.body)
      .returning();

    return service;
  },
  {
    authorize: ["Administrator"],
    body: z.object({
      name: z.string().min(2),
      description: z.string().min(10),
      requirements: z.string().array().min(1),
      guidelines: z.string().min(10),
      categoryId: z.coerce.bigint()
    })
  }
);
