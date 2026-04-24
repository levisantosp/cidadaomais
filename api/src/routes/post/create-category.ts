import { db, schema } from 'db'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../../plugins/auth-plugin'
import { ConflictException } from '../../utils/HttpException'

export const createCategory = new Elysia().use(authPlugin).post(
  '/categories',
  async (ctx) => {
    const category = await db.transaction(async (tx) => {
      const [category] = await tx
        .select({
          id: schema.category.id
        })
        .from(schema.category)
        .where(eq(schema.category.name, ctx.body.name))
        .limit(1)
      if (category) {
        throw new ConflictException('A category with this name already exists')
      }

      const [newCategory] = await tx
        .insert(schema.category)
        .values(ctx.body)
        .returning()

      return newCategory
    })

    return category
  },
  {
    authorize: ['Administrator'],
    body: z.object({
      name: z.string().min(2).trim()
    })
  }
)