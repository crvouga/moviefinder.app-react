import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './backend/trpc/app-router';
import { createContext } from './backend/trpc/context';

export const respond = (request: Request): Promise<Response> => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: request,
    router: appRouter,
    createContext,
  });
};
