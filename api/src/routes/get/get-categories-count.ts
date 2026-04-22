import { db, schema } from 'db'
import { count } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { authPlugin } from '../../plugins/auth-plugin'

export const getCategoriesCount = new Elysia().use(authPlugin).get(
  '/categories-count',
  async () => {
    const [rows] = await db
      .select({
        count: count()
      })
      .from(schema.category)

    return {
      count: rows.count
    }
  },
  {
    authorize: ['Administrator']
  }
)
