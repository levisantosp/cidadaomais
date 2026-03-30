import { db } from 'db'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '@/plugins/auth-plugin'
import { NotFoundException } from '@/utils/HttpException'

export const getEntitiy = new Elysia().use(authPlugin).get(
  '/entities/:id',
  async ({ params }) => {
    const entity = await db.query.entity.findFirst({
      where: (entity, { eq }) => eq(entity.id, params.id)
    })

    if (!entity) {
      throw new NotFoundException('Entity not found')
    }

    return {
      entity
    }
  },
  {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    })
  }
)
