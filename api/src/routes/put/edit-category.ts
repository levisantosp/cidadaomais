import { db, schema } from 'db'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../../plugins/auth-plugin'
import { NotFoundException } from '../../utils/HttpException'

export const editCategory = new Elysia().use(authPlugin).put(
  '/categories/:id',
  async (ctx) => {
    const [category] = await db
      .update(schema.category)
      .set(ctx.body)
      .where(eq(schema.category.id, ctx.params.id))
      .returning()
    if (!category) {
      throw new NotFoundException()
    }

    return category
  },
  {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    }),
    body: z.object({
      name: z.string().min(2).trim()
    })
  }
)
