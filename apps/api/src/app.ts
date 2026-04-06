import { cors } from "@elysiajs/cors"
import { openapi } from "@elysiajs/openapi"
import { Elysia } from "elysia"
import { logger } from "logger"
import { z } from "zod"
import { auth } from "./auth"
import { OpenAPI } from "./plugins/auth-plugin"
import { deleteEntity } from "./routes/delete/delete-entity"
import { getEntity } from "./routes/get/get-entity"
import { getServicesCount } from "./routes/get/get-services-count"
import { createEntity } from "./routes/post/create-entity"
import { editEntity } from "./routes/put/edit-entity"
import { HttpException } from "./utils/HttpException"

export const app = new Elysia()
  .onError((ctx) => {
    if (ctx.code === "VALIDATION") {
      return ctx.status("Unprocessable Content", ctx.error)
    }

    if (ctx.error instanceof HttpException) {
      return ctx.status(ctx.error.statusText, {
        status: ctx.error.statusText,
        code: ctx.code,
        error: ctx.error.message
      })
    }

    if (ctx.error instanceof Error) {
      logger.error(ctx.error.stack ?? ctx.error)
    }

    return ctx.status("Internal Server Error", {
      status: "Internal Server Error",
      code: ctx.code,
      error: "Internal Server Error"
    })
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
        zod: z.toJSONSchema
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
  .mount(auth.handler)
  .use(deleteEntity)
  .use(getEntity)
  .use(createEntity)
  .use(editEntity)
  .use(getServicesCount)

export type App = typeof app
