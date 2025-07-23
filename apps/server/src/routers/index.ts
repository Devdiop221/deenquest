import {
  protectedProcedure, publicProcedure,
  router,
} from "../lib/trpc";
import { categoriesRouter } from "./categories";
import { quizzesRouter } from "./quizzes";
import { lecturesRouter } from "./lectures";
import { favoritesRouter } from "./favorites";
import { userRouter } from "./user";

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
});
export type AppRouter = typeof appRouter;
