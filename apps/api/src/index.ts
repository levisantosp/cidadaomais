import { cors } from "@elysiajs/cors"
import openapi from "@elysiajs/openapi"
import { Elysia } from "elysia"
import { logger } from "logger"
import { z } from "zod"
import { auth } from "@/auth"
import { OpenAPI } from "@/plugins/auth-plugin"

const app = new Elysia()
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
	.listen(3333)

logger.info(
	`HTTP server running at http://${app.server?.hostname}:${app.server?.port}`
)
