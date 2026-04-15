import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";
import { NotFoundException } from "../../utils/HttpException";

export const getService = new Elysia().get(
  "/services/:id",
  async (ctx) => {
    const [service] = await db
      .select()
      .from(schema.service)
      .where(eq(schema.service.id, ctx.params.id))
      .limit(1);
    if (!service) {
      throw new NotFoundException();
    }

    return service;
  },
  {
    params: z.object({
      id: z.coerce.bigint()
    })
  }
);
