import { Db } from '~/@/db/interface'
import { toDeterministicHash } from '~/@/deterministic-hash'
import { ILogger } from '~/@/logger'
import { PubSub } from '~/@/pub-sub'
import { isOk } from '~/@/result'
import { throttleByKey } from '~/@/throttle'
import { TimeSpan } from '~/@/time-span'
import { IMediaDb } from '../interface/interface'

export type OneWaySyncRemoteToLocalMsg = {
  t: 'synced-remote-to-local'
  remoteQuery: Db.InferQueryOutput<typeof IMediaDb.parser>
  localUpsert: Db.InferUpsertOutput<typeof IMediaDb.parser>
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
  const remoteToLocalSync = throttleByKey(
    config.throttle,
    (query: Db.InferQueryInput<typeof IMediaDb.parser>) => {
      return toDeterministicHash(query)
    },
    async (query: Db.InferQueryInput<typeof IMediaDb.parser>) => {
      const remoteQueried = await config.remote.query(query)
      const media = isOk(remoteQueried) ? remoteQueried.value.entities.items : []
      const localUpsert = await config.local.upsert({ entities: media })
      config.pubSub.publish({
        t: 'synced-remote-to-local',
        remoteQuery: remoteQueried,
        localUpsert,
      })
    }
  )
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
