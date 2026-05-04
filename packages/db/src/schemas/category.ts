import { bigint, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { snowflake } from '../utils/snowflake'

export const category = pgTable('category', {
  id: bigint('id', {
    mode: 'bigint'
  })
    .primaryKey()
    .$defaultFn(snowflake),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date())
})