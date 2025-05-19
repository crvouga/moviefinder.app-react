import { createTRPCClient } from '@trpc/client'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { ILogger } from '~/@/logger'
import { ENDPOINT } from '../@/shared'
import { AppRouter } from '../backend/app-router'

export const TrpcClient = (config: { backendUrl: string; logger: ILogger }) => {
  const logger = config.logger.prefix(['trpc-client'])
  const url = `${config.backendUrl}${ENDPOINT}`

  logger.info('initializing trpc client', { url })

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
