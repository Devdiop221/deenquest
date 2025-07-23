import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../lib/trpc";
import { db, quizzes, categories, userProgress, userStats } from "../db";
import { eq, and, sql } from "drizzle-orm";

export const quizzesRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        question: quizzes.question,
        options: quizzes.options,
        correctAnswerIndex: quizzes.correctAnswerIndex,
        explanation: quizzes.explanation,
        difficulty: quizzes.difficulty,
        xpReward: quizzes.xpReward,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
        },
      })
      .from(quizzes)
      .leftJoin(categories, eq(quizzes.categoryId, categories.id));
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const quiz = await db
        .select({
          id: quizzes.id,
          title: quizzes.title,
          question: quizzes.question,
          options: quizzes.options,
          correctAnswerIndex: quizzes.correctAnswerIndex,
          explanation: quizzes.explanation,
          difficulty: quizzes.difficulty,
          xpReward: quizzes.xpReward,
          category: {
            id: categories.id,
            name: categories.name,
            icon: categories.icon,
          },
        })
        .from(quizzes)
        .leftJoin(categories, eq(quizzes.categoryId, categories.id))
        .where(eq(quizzes.id, input.id));

      return quiz[0] || null;
    }),

  getByCategory: publicProcedure
    .input(z.object({ categoryId: z.string().uuid() }))
    .query(async ({ input }) => {
      return await db
        .select({
          id: quizzes.id,
          title: quizzes.title,
          question: quizzes.question,
          options: quizzes.options,
          correctAnswerIndex: quizzes.correctAnswerIndex,
          explanation: quizzes.explanation,
          difficulty: quizzes.difficulty,
          xpReward: quizzes.xpReward,
        })
        .from(quizzes)
        .where(eq(quizzes.categoryId, input.categoryId));
    }),

  submitAnswer: protectedProcedure
    .input(z.object({
      quizId: z.string().uuid(),
      selectedAnswer: z.number().min(0).max(3),
      timeSpent: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Get the quiz to check correct answer
      const quiz = await db.select().from(quizzes).where(eq(quizzes.id, input.quizId));
      if (!quiz[0]) throw new Error("Quiz not found");

      const isCorrect = input.selectedAnswer === quiz[0].correctAnswerIndex;
      const score = isCorrect ? 100 : 0;

      // Record user progress
      await db.insert(userProgress).values({
        userId: ctx.session.user.id,
        quizId: input.quizId,
        score,
        timeSpent: input.timeSpent,
      });

      // Update user stats if correct
      if (isCorrect) {
        await db
          .insert(userStats)
          .values({
            userId: ctx.session.user.id,
            totalXp: quiz[0].xpReward,
            quizzesCompleted: 1,
          })
          .onConflictDoUpdate({
            target: userStats.userId,
            set: {
              totalXp: sql`${userStats.totalXp} + ${quiz[0].xpReward}`,
              quizzesCompleted: sql`${userStats.quizzesCompleted} + 1`,
              updatedAt: new Date(),
            },
          });
      }

      return {
        isCorrect,
        correctAnswer: quiz[0].correctAnswerIndex,
        explanation: quiz[0].explanation,
        xpEarned: isCorrect ? quiz[0].xpReward : 0,
      };
    }),
});