import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as authSchema from "./schema/auth";
import * as deenquestSchema from "./schema/deenquest";

// Load environment variables
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: { ...authSchema, ...deenquestSchema },
});

export * from "./schema/auth";
export * from "./schema/deenquest";

