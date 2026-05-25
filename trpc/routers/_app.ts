
import { credentiialsRouter } from '@/features/credential/server/router';
import {createTRPCRouter } from '../init';
import { workflowsRouter } from '@/features/workflow/server/router';
import { executionRouter } from '@/features/executions/server/router';

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  Credential: credentiialsRouter,
  execution: executionRouter,
  
});
// export type definition of API
export type AppRouter = typeof appRouter;