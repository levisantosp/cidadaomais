import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";
import { NotFoundException } from "../../utils/HttpException";

export const getUnit = new Elysia().get(
  "/units/:id",
  async (ctx) => {
    const unit = await db.query.entityUnit.findFirst({
      where: eq(schema.entityUnit.id, ctx.params.id),
      with: {
        entity: true
      }
    });
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
