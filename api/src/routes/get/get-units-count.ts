import { db, schema } from "db";
import { count } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../plugins/auth-plugin";

export const getUnitsCount = new Elysia().use(authPlugin).get(
  "/units-count",
  async () => {
    const [rows] = await db
      .select({
        count: count()
      })
      .from(schema.entityUnit);

    return {
      count: rows.count
    };
  },
  {
    authorize: ["Administrator"]
  }
);
