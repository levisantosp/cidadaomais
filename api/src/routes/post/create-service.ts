import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../plugins/auth-plugin";
import { NotFoundException } from "../../utils/HttpException";

export const createService = new Elysia().use(authPlugin).post(
  "/services",
  async (ctx) => {
    const service = await db.transaction(async (tx) => {
      const [category] = await tx
        .select({
          id: schema.category.id
        })
        .from(schema.category)
        .where(eq(schema.category.id, ctx.body.categoryId));
      if (!category) {
        throw new NotFoundException("Category not found");
      }

      const [service] = await tx
        .insert(schema.service)
        .values(ctx.body)
        .returning();

      return service;
    });

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
