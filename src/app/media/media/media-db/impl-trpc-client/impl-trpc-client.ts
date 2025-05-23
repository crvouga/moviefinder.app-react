import { TrpcClient } from '~/app/trpc/frontend/trpc-client'
import { IMediaDb } from '../interface/interface'

export type Config = {
  t: 'trpc-client'
  trpcClient: TrpcClient
}

export const MediaDb = (config: Config): IMediaDb => {
  return {
    async query(query) {
      const queried = await config.trpcClient.mediaDb.query.query(query)
      return queried
    },
    async upsert(input) {
      const upserted = await config.trpcClient.mediaDb.upsert.mutate(input)
      return upserted
    },
    liveQuery(_query) {
      throw new Error('Not implemented')
    },
  }
}
