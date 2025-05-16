import { Db } from '~/@/db/interface'
import { toDeterministicHash } from '~/@/deterministic-hash'
import { ILogger } from '~/@/logger'
import { PubSub } from '~/@/pub-sub'
import { isOk } from '~/@/result'
import { throttleByKey } from '~/@/throttle'
import { TimeSpan } from '~/@/time-span'
import { ICreditDb } from '../../credit/credit-db/interface'
import { IPersonDb } from '../../person/person-db/interface'
import { IRelationshipDb } from '../../relationship/relationship-db/interface'
import { IVideoDb } from '../../video/video-db/interface'
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
  relatedDbs: {
    creditDb: ICreditDb
    relationshipDb: IRelationshipDb
    videoDb: IVideoDb
    personDb: IPersonDb
  }
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
          config.local.upsert({
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
