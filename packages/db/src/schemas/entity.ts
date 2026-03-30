import { bigint, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { snowflake } from '../utils/snowflake'

export const entity = pgTable('entity', {
  id: bigint('id', {
    mode: 'bigint'
  })
    .primaryKey()
    .$defaultFn(snowflake),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 3
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    precision: 3
  })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date())
})
