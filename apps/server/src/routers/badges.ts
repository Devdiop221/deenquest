import { z } from 'zod';
import { router, publicProcedure } from '../lib/trpc';
import { db } from '../db';
import { badges, userBadges, userStats } from '../db/schema/deenquest';
import { eq, and } from 'drizzle-orm';

export const badgesRouter = router({
  // Get all available badges
  getAll: publicProcedure.query(async () => {
    return await db.select().from(badges);
  }),

  // Get user's unlocked badges
  getUserBadges: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await db
        .select({
          badge: badges,
          unlockedAt: userBadges.unlockedAt,
        })
        .from(userBadges)
        .innerJoin(badges, eq(badges.id, userBadges.badgeId))
        .where(eq(userBadges.userId, input.userId));
    }),

  // Get user stats
  getUserStats: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const stats = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, input.userId))
        .limit(1);

      if (stats.length === 0) {
        // Create initial stats for new user
        const newStats = await db
          .insert(userStats)
          .values({
            userId: input.userId,
            totalXp: 0,
            level: 1,
            quizzesCompleted: 0,
            lecturesListened: 0,
            currentStreak: 0,
            longestStreak: 0,
          })
          .returning();
        return newStats[0];
      }

      return stats[0];
    }),

  // Update user stats (when completing quiz, etc.)
  updateStats: publicProcedure
    .input(z.object({
      userId: z.string(),
      xpGained: z.number().optional(),
      quizCompleted: z.boolean().optional(),
      lectureListened: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const currentStats = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, input.userId))
        .limit(1);

      if (currentStats.length === 0) {
        // Create initial stats
        return await db
          .insert(userStats)
          .values({
            userId: input.userId,
            totalXp: input.xpGained || 0,
            level: 1,
            quizzesCompleted: input.quizCompleted ? 1 : 0,
            lecturesListened: input.lectureListened ? 1 : 0,
            currentStreak: 1,
            longestStreak: 1,
            lastActivityDate: new Date(),
          })
          .returning();
      }

      const stats = currentStats[0];
      const newXp = stats.totalXp + (input.xpGained || 0);
      const newLevel = Math.floor(newXp / 100) + 1; // 100 XP per level

      return await db
        .update(userStats)
        .set({
          totalXp: newXp,
          level: newLevel,
          quizzesCompleted: input.quizCompleted
            ? stats.quizzesCompleted + 1
            : stats.quizzesCompleted,
          lecturesListened: input.lectureListened
            ? stats.lecturesListened + 1
            : stats.lecturesListened,
          lastActivityDate: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userStats.userId, input.userId))
        .returning();
    }),

  // Check and unlock badges for user
  checkBadges: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const stats = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, input.userId))
        .limit(1);

      if (stats.length === 0) return [];

      const userStat = stats[0];
      const allBadges = await db.select().from(badges);
      const userBadgesList = await db
        .select()
        .from(userBadges)
        .where(eq(userBadges.userId, input.userId));

      const unlockedBadgeIds = userBadgesList.map(ub => ub.badgeId);
      const newlyUnlocked = [];

      for (const badge of allBadges) {
        if (unlockedBadgeIds.includes(badge.id)) continue;

        const condition = JSON.parse(badge.condition);
        let shouldUnlock = false;

        // Check different badge conditions
        switch (condition.type) {
          case 'quizzes_completed':
            shouldUnlock = userStat.quizzesCompleted >= condition.value;
            break;
          case 'lectures_listened':
            shouldUnlock = userStat.lecturesListened >= condition.value;
            break;
          case 'level_reached':
            shouldUnlock = userStat.level >= condition.value;
            break;
          case 'xp_earned':
            shouldUnlock = userStat.totalXp >= condition.value;
            break;
          case 'streak':
            shouldUnlock = userStat.currentStreak >= condition.value;
            break;
        }

        if (shouldUnlock) {
          await db.insert(userBadges).values({
            userId: input.userId,
            badgeId: badge.id,
          });
          newlyUnlocked.push(badge);
        }
      }

      return newlyUnlocked;
    }),
});