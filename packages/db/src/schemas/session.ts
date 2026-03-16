import { bigint, index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { snowflake } from "../utils/snowflake"
import { user } from "./user"

export const session = pgTable(
	"session",
	{
		id: bigint("id", { mode: "bigint" }).primaryKey().$defaultFn(snowflake),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: bigint("user_id", { mode: "bigint" })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" })
	},
	table => [index("session_userId_idx").on(table.userId)]
)
