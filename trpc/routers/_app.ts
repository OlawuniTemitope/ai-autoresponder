
import { credentiialsRouter } from '@/features/credential/server/router';
import {createTRPCRouter } from '../init';
import { workflowsRouter } from '@/features/workflow/server/router';

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  Credential: credentiialsRouter,
  
});
// export type definition of API
export type AppRouter = typeof appRouter;