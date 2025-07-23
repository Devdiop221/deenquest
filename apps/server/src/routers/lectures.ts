import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../lib/trpc";
import { db, lectures, categories, userStats } from "../db";
import { eq, sql } from "drizzle-orm";

export const lecturesRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db
      .select({
        id: lectures.id,
        title: lectures.title,
        description: lectures.description,
        audioUrl: lectures.audioUrl,
        textContent: lectures.textContent,
        duration: lectures.duration,
        xpReward: lectures.xpReward,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
        },
      })
      .from(lectures)
      .leftJoin(categories, eq(lectures.categoryId, categories.id));
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const lecture = await db
        .select({
          id: lectures.id,
          title: lectures.title,
          description: lectures.description,
          audioUrl: lectures.audioUrl,
          textContent: lectures.textContent,
          duration: lectures.duration,
          xpReward: lectures.xpReward,
          category: {
            id: categories.id,
            name: categories.name,
            icon: categories.icon,
          },
        })
        .from(lectures)
        .leftJoin(categories, eq(lectures.categoryId, categories.id))
        .where(eq(lectures.id, input.id));

      return lecture[0] || null;
    }),

  getByCategory: publicProcedure
    .input(z.object({ categoryId: z.string().uuid() }))
    .query(async ({ input }) => {
      return await db
        .select({
          id: lectures.id,
          title: lectures.title,
          description: lectures.description,
          audioUrl: lectures.audioUrl,
          textContent: lectures.textContent,
          duration: lectures.duration,
          xpReward: lectures.xpReward,
        })
        .from(lectures)
        .where(eq(lectures.categoryId, input.categoryId));
    }),

  markCompleted: protectedProcedure
    .input(z.object({
      lectureId: z.string().uuid(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Get the lecture to get XP reward
      const lecture = await db.select().from(lectures).where(eq(lectures.id, input.lectureId));
      if (!lecture[0]) throw new Error("Lecture not found");

      // Update user stats
      await db
        .insert(userStats)
        .values({
          userId: ctx.session.user.id,
          totalXp: lecture[0].xpReward,
          lecturesCompleted: 1,
        })
        .onConflictDoUpdate({
          target: userStats.userId,
          set: {
            totalXp: sql`${userStats.totalXp} + ${lecture[0].xpReward}`,
            lecturesCompleted: sql`${userStats.lecturesCompleted} + 1`,
            updatedAt: new Date(),
          },
        });

      return {
        xpEarned: lecture[0].xpReward,
      };
    }),
});