import { bigint, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { snowflake } from '../utils/snowflake'
import { entity } from './entity'
import { user } from './user'

export const actionEnum = pgEnum('AuditAction', ['Create', 'Update', 'Delete'])

export const audit = pgTable('audit', {
  id: bigint('id', {
    mode: 'bigint'
  })
    .primaryKey()
    .$defaultFn(snowflake),
  userId: bigint('user_id', {
    mode: 'bigint'
  }).references(() => user.id, {
    onDelete: 'set null'
  }),
  entityId: bigint('entity_id', {
    mode: 'bigint'
  }).references(() => entity.id, {
    onDelete: 'set null'
  }),
  entity: text('entity').notNull(),
  action: actionEnum('action').notNull(),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull()
})
