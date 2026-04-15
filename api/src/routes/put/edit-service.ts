import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../plugins/auth-plugin";
import { NotFoundException } from "../../utils/HttpException";

export const editService = new Elysia().use(authPlugin).put(
  "/services/:id",
  async (ctx) => {
    const [service] = await db
      .update(schema.service)
      .set(ctx.body)
      .where(eq(schema.service.id, ctx.params.id))
      .returning();
    if (!service) {
      throw new NotFoundException();
    }

    return service;
  },
  {
    authorize: ["Administrator"],
    params: z.object({
      id: z.coerce.bigint()
    }),
    body: z.object({
      name: z.string().min(2).optional(),
      description: z.string().min(10).optional(),
      requirements: z.string().array().min(1).optional(),
      guidelines: z.string().min(10).optional(),
      categoryId: z.coerce.bigint().optional()
    })
  }
);
