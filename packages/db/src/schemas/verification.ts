import { bigint, index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { snowflake } from "../utils/snowflake"

export const verification = pgTable(
  "verification",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().$defaultFn(snowflake),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
)
