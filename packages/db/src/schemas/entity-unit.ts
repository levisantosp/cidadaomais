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
  }).references(() => entity.id, {
    onDelete: "cascade"
  }),
  name: text("name").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date())
});
