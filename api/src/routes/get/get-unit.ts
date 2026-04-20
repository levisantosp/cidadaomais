import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";
import { NotFoundException } from "../../utils/HttpException";

export const getUnit = new Elysia().get(
  "/units/:id",
  async (ctx) => {
    const [unit] = await db
      .select()
      .from(schema.entityUnit)
      .where(eq(schema.entityUnit.id, ctx.params.id))
      .limit(1);
    if (!unit) {
      throw new NotFoundException();
    }
    
    return unit;
  },
  {
    params: z.object({
      id: z.coerce.bigint()
    })
  }
);
