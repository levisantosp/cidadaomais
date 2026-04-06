import { db, schema } from "db";
import { count } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../plugins/auth-plugin";

export const getServicesCount = new Elysia().use(authPlugin).get(
  "/services-count",
  async () => {
    const [rows] = await db
      .select({
        count: count()
      })
      .from(schema.service);

    return {
      count: rows.count
    };
  },
  {
    authorize: ["Administrator"]
  }
);
