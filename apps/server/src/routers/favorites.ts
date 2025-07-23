import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc";
import { db, favorites, quizzes, lectures, categories } from "../db";
import { eq, and, or } from "drizzle-orm";

export const favoritesRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userFavorites = await db
      .select({
        id: favorites.id,
        contentId: favorites.contentId,
        contentType: favorites.contentType,
        createdAt: favorites.createdAt,
      })
      .from(favorites)
      .where(eq(favorites.userId, ctx.session.user.id));

    // Get quiz and lecture details for favorites
    const quizIds = userFavorites.filter(f => f.contentType === 'quiz').map(f => f.contentId);
    const lectureIds = userFavorites.filter(f => f.contentType === 'lecture').map(f => f.contentId);

    const [favoriteQuizzes, favoriteLectures] = await Promise.all([
      quizIds.length > 0 ? db
        .select({
          id: quizzes.id,
          title: quizzes.title,
          question: quizzes.question,
          difficulty: quizzes.difficulty,
          category: {
            id: categories.id,
            name: categories.name,
            icon: categories.icon,
          },
        })
        .from(quizzes)
        .leftJoin(categories, eq(quizzes.categoryId, categories.id))
        .where(or(...quizIds.map(id => eq(quizzes.id, id)))) : [],

      lectureIds.length > 0 ? db
        .select({
          id: lectures.id,
          title: lectures.title,
          description: lectures.description,
          duration: lectures.duration,
          category: {
            id: categories.id,
            name: categories.name,
            icon: categories.icon,
          },
        })
        .from(lectures)
        .leftJoin(categories, eq(lectures.categoryId, categories.id))
        .where(or(...lectureIds.map(id => eq(lectures.id, id)))) : [],
    ]);

    return {
      quizzes: favoriteQuizzes,
      lectures: favoriteLectures,
    };
  }),

  add: protectedProcedure
    .input(z.object({
      contentId: z.string().uuid(),
      contentType: z.enum(['quiz', 'lecture']),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if already favorited
      const existing = await db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, ctx.session.user.id),
            eq(favorites.contentId, input.contentId),
            eq(favorites.contentType, input.contentType)
          )
        );

      if (existing.length > 0) {
        throw new Error("Already favorited");
      }

      await db.insert(favorites).values({
        userId: ctx.session.user.id,
        contentId: input.contentId,
        contentType: input.contentType,
      });

      return { success: true };
    }),

  remove: protectedProcedure
    .input(z.object({
      contentId: z.string().uuid(),
      contentType: z.enum(['quiz', 'lecture']),
    }))
    .mutation(async ({ input, ctx }) => {
      await db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, ctx.session.user.id),
            eq(favorites.contentId, input.contentId),
            eq(favorites.contentType, input.contentType)
          )
        );

      return { success: true };
    }),
});