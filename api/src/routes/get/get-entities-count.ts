import { db, schema } from 'db'
import { count } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { authPlugin } from '../../plugins/auth-plugin'

export const getEntitiesCount = new Elysia().use(authPlugin).get(
  '/entities-count',
  async () => {
    const [rows] = await db
      .select({
        count: count()
      })
      .from(schema.entity)

    return {
      count: rows.count
    }
  },
  {
    authorize: ['Administrator']
  }
)