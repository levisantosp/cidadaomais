import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().startsWith("postgresql://"),
  MACHINE_ID: z.coerce.bigint().min(0n).max(1023n)
});

export const env = schema.parse(Bun.env);
