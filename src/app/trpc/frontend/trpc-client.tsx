import { createTRPCClient } from '@trpc/client'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { ILogger } from '~/@/logger'
import { ENDPOINT } from '../@/shared'
import { AppRouter } from '../backend/app-router'

export const TrpcClient = (config: { backendUrl: string; logger: ILogger }) => {
  const logger = config.logger.prefix(['trpc-client'])
  // If backendUrl is empty, use same origin (relative URL)
  // Otherwise, construct the full URL
  const url = config.backendUrl ? `${config.backendUrl}${ENDPOINT}` : ENDPOINT

  logger.info('initializing trpc client', { url, backendUrl: config.backendUrl || '(same origin)' })

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url,
        headers() {
          logger.debug('sending request', { url })
          return {}
        },
      }),
    ],
  })
}

export type TrpcClient = ReturnType<typeof TrpcClient>
