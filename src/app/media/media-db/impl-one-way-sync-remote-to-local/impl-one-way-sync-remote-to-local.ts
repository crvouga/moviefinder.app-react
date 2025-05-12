import { ILogger } from '~/@/logger'
import { isOk } from '~/@/result'
import { PubSub } from '~/@/pub-sub'
import { IMediaDb } from '../interface/interface'
import { MediaDbQueryOutput } from '../interface/query-output'
import { MediaDbUpsertOutput } from '../interface/upsert-output'

export type OneWaySyncRemoteToLocalMsg = {
  t: 'synced-remote-to-local'
  remoteQuery: MediaDbQueryOutput
  localUpsert: MediaDbUpsertOutput
}

export type Config = {
  t: 'one-way-sync-remote-to-local'
  logger: ILogger
  local: IMediaDb
  remote: IMediaDb
  pubSub: PubSub<OneWaySyncRemoteToLocalMsg>
}

export const MediaDb = (config: Config): IMediaDb => {
  return {
    ...config.local,
    liveQuery(query) {
      config.remote.query(query).then(async (remoteQuery) => {
        const media = isOk(remoteQuery) ? remoteQuery.value.media.items : []
        const localUpsert = await config.local.upsert({ media })
        config.pubSub.publish({
          t: 'synced-remote-to-local',
          remoteQuery,
          localUpsert,
        })
      })
      return config.local.liveQuery(query)
    },
    query(query) {
      config.remote.query(query).then(async (remoteQuery) => {
        const media = isOk(remoteQuery) ? remoteQuery.value.media.items : []
        const localUpsert = await config.local.upsert({ media })
        config.pubSub.publish({
          t: 'synced-remote-to-local',
          remoteQuery,
          localUpsert,
        })
      })

      return config.local.query(query)
    },
  }
}
