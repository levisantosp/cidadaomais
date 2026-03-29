import { bigint, pgTable, text } from 'drizzle-orm/pg-core'
import { snowflake } from '../utils/snowflake'

export const entity = pgTable('entity', {
  id: bigint('id', {
    mode: 'bigint'
  })
    .primaryKey()
    .$defaultFn(snowflake),
  name: text('name').notNull()
})
