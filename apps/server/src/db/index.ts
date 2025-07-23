import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from "./schema/auth";
import * as deenquestSchema from "./schema/deenquest";

export const db = drizzle(process.env.DATABASE_URL || "", {
  schema: { ...authSchema, ...deenquestSchema },
});

export * from "./schema/auth";
export * from "./schema/deenquest";

