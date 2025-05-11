import { createTRPCClient } from '@trpc/client'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { AppRouter } from '../backend/app-router'

export const TrpcClient = () => {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:8888/trpc',
      }),
    ],
  })
}

export type TrpcClient = ReturnType<typeof TrpcClient>
