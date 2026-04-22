import { db, schema } from 'db'
import { inArray } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../../plugins/auth-plugin'

export const createEntity = new Elysia().use(authPlugin).post(
  '/entities',
  async (ctx) => {
    const entity = await db.transaction(async (tx) => {
      const [entity] = await tx
        .insert(schema.entity)
        .values(ctx.body)
        .returning()

      await tx
        .update(schema.entityUnit)
        .set({
          entityId: entity.id
        })
        .where(inArray(schema.entityUnit.id, ctx.body.unitsIds))

      return entity
    })

    return entity
  },
  {
    authorize: ['Administrator'],
    body: z.object({
      name: z.string().min(2),
      description: z.string().min(2),
      phone: z.string().optional(),
      email: z.email().optional(),
      website: z.url().optional(),
      unitsIds: z.coerce.bigint().array().min(1).max(100)
    })
  }
)
