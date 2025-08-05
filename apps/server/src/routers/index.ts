import {
  protectedProcedure, publicProcedure,
  router,
} from "../lib/trpc";
import { categoriesRouter } from "./categories";
import { quizzesRouter } from "./quizzes";
import { lecturesRouter } from "./lectures";
import { favoritesRouter } from "./favorites";
import { userRouter } from "./user";
import { badgesRouter } from "./badges";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  categories: categoriesRouter,
  quizzes: quizzesRouter,
  lectures: lecturesRouter,
  favorites: favoritesRouter,
  user: userRouter,
  badges: badgesRouter,
});
export type AppRouter = typeof appRouter;
