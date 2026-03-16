import { defineConfig } from "drizzle-kit"

export default defineConfig({
	out: "./packages/db/src/migrations",
	schema: [
		"./packages/db/src/schemas/user.ts",
		"./packages/db/src/schemas/session.ts",
		"./packages/db/src/schemas/account.ts",
		"./packages/db/src/schemas/verification.ts"
	],
	dbCredentials: {
		url: Bun.DATABASE_URL
	},
	dialect: "postgresql",
	casing: "snake_case"
})
