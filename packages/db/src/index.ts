import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from './env'
import * as schema from './schemas'

export const db = drizzle(env.DATABASE_URL, {
  schema,
  casing: 'snake_case'
})

export { schema }

export type Role = typeof schema.user.$inferSelect.role
export type User = typeof schema.user.$inferSelect
export type Category = typeof schema.category.$inferSelect
export type Service = typeof schema.service.$inferSelect

type Schema = ExtractTablesWithRelations<typeof schema>

export type ServiceGetPayload<T extends DBQueryConfig<'many', true, Schema, Schema['service']>> = BuildQueryResult<
  Schema,
  Schema['service'],
  T
>