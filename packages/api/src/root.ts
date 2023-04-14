import { directoryRouter } from "./router/directory";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  directory: directoryRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
