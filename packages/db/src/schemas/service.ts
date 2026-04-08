import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { snowflake } from "../utils/snowflake";
import { category } from "./category";
import { relations } from "drizzle-orm";

export const service = pgTable("service", {
  id: bigint("id", {
    mode: "bigint"
  })
    .primaryKey()
    .$defaultFn(snowflake),
  categoryId: bigint("category_id", {
    mode: "bigint"
  })
    .notNull()
    .references(() => category.id, {
      onDelete: "restrict"
    }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date())
});

export const serviceRelations = relations(service, ({ one }) => ({
  category: one(category, {
    references: [category.id],
    fields: [service.categoryId]
  })
}));
