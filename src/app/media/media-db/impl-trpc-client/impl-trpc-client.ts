import { trpcClient } from '~/app/trpc/frontend/trpc-client'
import { IMediaDb } from '../interface'

export type Config = {
  t: 'trpc-client'
}

export const MediaDb = (_config: Config): IMediaDb => {
  return {
    async query(query) {
      const queried = await trpcClient.mediaDb.query.query(query)
      return queried
    },
  }
}
