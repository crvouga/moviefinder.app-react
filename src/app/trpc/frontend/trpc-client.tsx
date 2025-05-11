import { createTRPCClient } from '@trpc/client'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { ENDPOINT } from '../@/shared'
import { AppRouter } from '../backend/app-router'

export const TrpcClient = (config: { backendUrl: string }) => {
  return createTRPCClient<AppRouter>({
    links: [httpBatchLink({ url: `${config.backendUrl}${ENDPOINT}` })],
  })
}

export type TrpcClient = ReturnType<typeof TrpcClient>
