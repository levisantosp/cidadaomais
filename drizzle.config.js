import { defineConfig } from "drizzle-kit"

export default defineConfig({
	out: "./packages/db/src/migrations",
	schema: "./packages/db/src/schemas/*.ts",
	dbCredentials: {
		url: Bun.DATABASE_URL
	},
	dialect: "postgresql",
	casing: "snake_case"
})
