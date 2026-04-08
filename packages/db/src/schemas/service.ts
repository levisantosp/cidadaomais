import { relations } from "drizzle-orm";
import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { snowflake } from "../utils/snowflake";
import { category } from "./category";

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
  requirements: text("requirements").array().notNull(),
  guidelines: text("guidelines").notNull(),
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
