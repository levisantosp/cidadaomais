import { db, schema } from 'db'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { NotFoundException } from '../../utils/HttpException'

export const getCategory = new Elysia().get(
  '/categories/:id',
  async (ctx) => {
    const [category] = await db
      .select()
      .from(schema.category)
      .where(eq(schema.category.id, ctx.params.id))
      .limit(1)
    if (!category) {
      throw new NotFoundException()
    }

    return category
  },
  {
    params: z.object({
      id: z.coerce.bigint()
    })
  }
)
