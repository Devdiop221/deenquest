import { z } from "zod";
import { publicProcedure, router } from "../lib/trpc";
import { db, categories } from "../db";
import { eq } from "drizzle-orm";

export const categoriesRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(categories);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const category = await db.select().from(categories).where(eq(categories.id, input.id));
      return category[0] || null;
    }),
});