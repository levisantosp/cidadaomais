import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { logger } from "logger";
import { z } from "zod";
import { OpenAPI } from "./plugins/auth-plugin";
import { deleteEntity } from "./routes/delete/delete-entity";
import { getAuditLog } from "./routes/get/get-audit-log";
import { getCategories } from "./routes/get/get-categories";
import { getCategoriesCount } from "./routes/get/get-categories-count";
import { getEntitiesCount } from "./routes/get/get-entities-count";
import { getEntity } from "./routes/get/get-entity";
import { getServices } from "./routes/get/get-services";
import { getServicesCount } from "./routes/get/get-services-count";
import { getUnitsCount } from "./routes/get/get-units-count";
import { createCategory } from "./routes/post/create-category";
import { createEntity } from "./routes/post/create-entity";
import { createService } from "./routes/post/create-service";
import { editEntity } from "./routes/put/edit-entity";
import { HttpException } from "./utils/HttpException";

export const app = new Elysia()
  .onError((ctx) => {
    if (ctx.code === "VALIDATION") {
      return ctx.status("Unprocessable Content", ctx.error);
    }

    if (ctx.error instanceof HttpException) {
      return ctx.status(ctx.error.statusText, {
        status: ctx.error.statusText,
        code: ctx.code,
        message: ctx.error.message
      });
    }

    if (ctx.error instanceof Error) {
      logger.error(ctx.error.stack ?? ctx.error);
    }

    return ctx.status("Internal Server Error", {
      status: "Internal Server Error",
      code: ctx.code,
      message: "Internal Server Error"
    });
  })
  .get("/", () => ({ message: "Hello, Elysia!" }))
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths()
      },
      path: "/docs",
      mapJsonSchema: {
        zod: (schema: z.ZodType) =>
          z.toJSONSchema(schema, {
            target: "openapi-3.0",
            unrepresentable: "any",
            override(ctx) {
              if (ctx.zodSchema._zod.def.type === "bigint") {
                ctx.jsonSchema.type = "string";
                ctx.jsonSchema.format = "int64";
                ctx.jsonSchema.example = "1234567890123456789";
              }
            }
          })
      }
    })
  )
  .use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  )
  .use(deleteEntity)
  .use(getEntity)
  .use(createEntity)
  .use(editEntity)
  .use(getServicesCount)
  .use(getEntitiesCount)
  .use(getCategoriesCount)
  .use(getUnitsCount)
  .use(getAuditLog)
  .use(createService)
  .use(getCategories)
  .use(createCategory)
  .use(getServices);

export type App = typeof app;
