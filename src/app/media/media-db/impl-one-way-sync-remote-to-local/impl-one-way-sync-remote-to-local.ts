import { ILogger } from '~/@/logger'
import { PubSub } from '~/@/pub-sub'
import { isOk } from '~/@/result'
import { TimeSpan } from '~/@/time-span'
import { IMediaDb } from '../interface/interface'
import { MediaDbQueryInput } from '../interface/query-input'
import { MediaDbQueryOutput } from '../interface/query-output'
import { MediaDbUpsertOutput } from '../interface/upsert-output'
import { throttle } from '~/@/throttle'

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
  throttle: TimeSpan
}

export const MediaDb = (config: Config): IMediaDb => {
  const remoteToLocalSync = throttle(config.throttle, async (query: MediaDbQueryInput) => {
    const remoteQueried = await config.remote.query(query)
    const media = isOk(remoteQueried) ? remoteQueried.value.media.items : []
    const localUpsert = await config.local.upsert({ media })
    config.pubSub.publish({
      t: 'synced-remote-to-local',
      remoteQuery: remoteQueried,
      localUpsert,
    })
  })
  return {
    ...config.local,
    liveQuery(query) {
      remoteToLocalSync(query)
      return config.local.liveQuery(query)
    },
    query(query) {
      remoteToLocalSync(query)
      return config.local.query(query)
    },
  }
}
