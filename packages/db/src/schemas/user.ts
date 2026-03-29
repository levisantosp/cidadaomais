import { relations } from 'drizzle-orm'
import { bigint, boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { snowflake } from '../utils/snowflake'
import { account } from './account'
import { session } from './session'

export const user = pgTable('user', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().$defaultFn(snowflake),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
})

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account)
}))
