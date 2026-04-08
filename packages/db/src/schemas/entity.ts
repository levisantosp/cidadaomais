import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { snowflake } from "../utils/snowflake";
import { relations } from "drizzle-orm";
import { entityUnit } from "./entity-unit";

export const entity = pgTable("entity", {
  id: bigint("id", {
    mode: "bigint"
  })
    .primaryKey()
    .$defaultFn(snowflake),
  name: text("name").notNull(),
  description: text("description").notNull(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3
  })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date())
});

export const entityRelations = relations(entity, ({ many }) => ({
  units: many(entityUnit)
}))
