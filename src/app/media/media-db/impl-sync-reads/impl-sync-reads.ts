import { IMediaDb } from '../interface/interface'

export type Config = {
  t: 'sync-reads'
  local: IMediaDb
  remote: IMediaDb
}

export const MediaDb = (config: Config): IMediaDb => {
  return {
    async query(query) {
      return config.remote.query(query)
    },
    async upsert(input) {
      return config.local.upsert(input)
    },
    async liveQuery(query) {
      return config.local.liveQuery(query)
    },
  }
}
