import { relations } from "drizzle-orm";
import {
  bigint,
  doublePrecision,
  pgTable,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { snowflake } from "../utils/snowflake";
import { entity } from "./entity";

export const entityUnit = pgTable("entity_unit", {
  id: bigint("id", {
    mode: "bigint"
  })
    .primaryKey()
    .$defaultFn(snowflake),
  entityId: bigint("entity_id", {
    mode: "bigint"
  })
    .notNull()
    .references(() => entity.id, {
      onDelete: "cascade"
    }),
  name: text("name").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
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

export const entityUnitRelations = relations(entityUnit, ({ one }) => ({
  entity: one(entity, {
    fields: [entityUnit.entityId],
    references: [entity.id]
  })
}));
