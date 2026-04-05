import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { openAPI } from "better-auth/plugins"
import { db } from "db"

export const auth = betterAuth({
  basePath: "/auth",
  baseURL: "http://localhost:3333",
  database: drizzleAdapter(db, {
    provider: "pg",
    transaction: true
  }),
  advanced: {
    database: {
      generateId: false
    }
  },
  emailAndPassword: {
    enabled: true
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
  plugins: [openAPI()],
  trustedOrigins: ["http://localhost:3000"],
  user: {
    additionalFields: {
      role: {
        type: ["Administrator", "User"],
        defaultValue: "User",
        input: false
      }
    }
  }
})
