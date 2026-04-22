import { db, schema } from 'db'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../../plugins/auth-plugin'
import { ConflictException, NotFoundException } from '../../utils/HttpException'

export const createService = new Elysia().use(authPlugin).post(
  '/services',
  async (ctx) => {
    const service = await db.transaction(async (tx) => {
      const [[category], [service]] = await Promise.all([
        tx
          .select({
            id: schema.category.id
          })
          .from(schema.category)
          .where(eq(schema.category.id, ctx.body.categoryId)),
        tx
          .select({
            id: schema.service.id
          })
          .from(schema.service)
          .where(eq(schema.service.name, ctx.body.name))
          .limit(1)
      ])
      if (!category) {
        throw new NotFoundException('Category not found')
      }
      if (service) {
        throw new ConflictException('A service with this name already exists')
      }

      const [newService] = await tx
        .insert(schema.service)
        .values(ctx.body)
        .returning()

      return newService
    })

    return service
  },
  {
    authorize: ['Administrator'],
    body: z.object({
      name: z.string().min(2),
      description: z.string().min(10),
      requirements: z.string().array().min(1),
      guidelines: z.string().min(10),
      categoryId: z.coerce.bigint()
    })
  }
)
