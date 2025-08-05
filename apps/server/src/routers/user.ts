import { protectedProcedure, router } from "../lib/trpc";
import { db } from "../db";
import { userStats, userBadges, badges } from "../db/schema/badges";
import { userProgress } from "../db/schema/deenquest";
import { eq, desc, count } from "drizzle-orm";

export const userRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, ctx.session.user.id));

    if (stats.length === 0) {
      // Create initial stats for new user
      await db.insert(userStats).values({
        userId: ctx.session.user.id,
      });

      return {
        totalXp: 0,
        level: 1,
        quizzesCompleted: 0,
        lecturesCompleted: 0,
      };
    }

    const userStat = stats[0];

    // Calculate level based on XP (every 100 XP = 1 level)
    const level = Math.floor((userStat.totalXp || 0) / 100) + 1;

    // Update level if it changed
    if (level !== userStat.level) {
      await db
        .update(userStats)
        .set({ level, updatedAt: new Date() })
        .where(eq(userStats.userId, ctx.session.user.id));
    }

    return {
      totalXp: userStat.totalXp,
      level,
      quizzesCompleted: userStat.quizzesCompleted,
      lecturesCompleted: userStat.lecturesCompleted,
    };
  }),

  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const recentProgress = await db
      .select({
        id: userProgress.id,
        quizId: userProgress.quizId,
        score: userProgress.score,
        timeSpent: userProgress.timeSpent,
        completedAt: userProgress.completedAt,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, ctx.session.user.id))
      .orderBy(desc(userProgress.completedAt))
      .limit(10);

    return recentProgress;
  }),

  getBadges: protectedProcedure.query(async ({ ctx }) => {
    const earnedBadges = await db
      .select({
        id: userBadges.id,
        unlockedAt: userBadges.unlockedAt,
        badge: {
          id: badges.id,
          name: badges.name,
          description: badges.description,
          icon: badges.icon,
        },
      })
      .from(userBadges)
      .leftJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, ctx.session.user.id))
      .orderBy(desc(userBadges.unlockedAt));

    return earnedBadges;
  }),
});
