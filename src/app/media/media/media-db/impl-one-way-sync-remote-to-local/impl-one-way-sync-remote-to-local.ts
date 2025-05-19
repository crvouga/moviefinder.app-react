import { IDb } from '~/@/db/interface'
import { toDeterministicHash } from '~/@/deterministic-hash'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger } from '~/@/logger'
import { PubSub } from '~/@/pub-sub'
import { isOk } from '~/@/result'
import { throttleByKeyDurable } from '~/@/throttle-by-key-durable'
import { TimeSpan } from '~/@/time-span'
import { ICreditDb } from '~/app/media/credit/credit-db/interface'
import { IPersonDb } from '~/app/media/person/person-db/interface'
import { IRelationshipDb } from '~/app/media/relationship/relationship-db/interface'
import { IVideoDb } from '~/app/media/video/video-db/interface'
import { IMediaDb } from '../interface/interface'

export type OneWaySyncRemoteToLocalMsg = {
  t: 'synced-remote-to-local'
  remoteQuery: IDb.InferQueryOutput<typeof IMediaDb.parser>
  localUpsert: IDb.InferUpsertOutput<typeof IMediaDb.parser>
}

export type Config = {
  t: 'one-way-sync-remote-to-local'
  logger: ILogger
  kvDb: IKvDb
  mediaDbLocal: IMediaDb
  mediaDbRemote: IMediaDb
  pubSub: PubSub<OneWaySyncRemoteToLocalMsg>
  throttle: TimeSpan
  relatedDbs: {
    creditDb: ICreditDb
    relationshipDb: IRelationshipDb
    videoDb: IVideoDb
    personDb: IPersonDb
  }
}

export const MediaDb = (config: Config): IMediaDb => {
  const remoteToLocalSync = throttleByKeyDurable(
    config.kvDb,
    config.throttle,
    (query: IDb.InferQueryInput<typeof IMediaDb.parser>) => {
      return toDeterministicHash(query)
    },
    async (query: IDb.InferQueryInput<typeof IMediaDb.parser>) => {
      const remoteQueried = await config.mediaDbRemote.query(query)
      const media = isOk(remoteQueried) ? remoteQueried.value.entities.items : []
      const localUpsert = await config.mediaDbLocal.upsert({ entities: media })
      if (isOk(remoteQueried)) {
        await Promise.all([
          config.relatedDbs.creditDb.upsert({
            entities: Object.values(remoteQueried.value.related.credit),
          }),
          config.relatedDbs.relationshipDb.upsert({
            entities: Object.values(remoteQueried.value.related.relationship),
          }),
          config.relatedDbs.videoDb.upsert({
            entities: Object.values(remoteQueried.value.related.video),
          }),
          config.relatedDbs.personDb.upsert({
            entities: Object.values(remoteQueried.value.related.person),
          }),
          config.mediaDbLocal.upsert({
            entities: Object.values(remoteQueried.value.related.media),
          }),
        ])
      }
      config.pubSub.publish({
        t: 'synced-remote-to-local',
        remoteQuery: remoteQueried,
        localUpsert,
      })
    }
  )
  return {
    ...config.mediaDbLocal,
    liveQuery(query) {
      remoteToLocalSync(query)
      return config.mediaDbLocal.liveQuery(query)
    },
    query(query) {
      remoteToLocalSync(query)
      return config.mediaDbLocal.query(query)
    },
  }
}
