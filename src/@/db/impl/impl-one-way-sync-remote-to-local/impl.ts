import { IDb } from '~/@/db/interface'
import { toDeterministicHash } from '~/@/deterministic-hash'
import { KvDb } from '~/@/kv-db/impl'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger } from '~/@/logger'
import { PubSub } from '~/@/pub-sub'
import { isOk } from '~/@/result'
import { throttleByKeyDurable } from '~/@/throttle-by-key-durable'
import { TimeSpan } from '~/@/time-span'
import { QueryInput } from '../../interface/query-input/query-input'
import { QueryOutput } from '../../interface/query-output/query-output'
import { UpsertOutput } from '../../interface/upsert-output/upsert-output'

export type Msg<
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
> = {
  t: 'synced-remote-to-local'
  remoteQuery: QueryOutput<TEntity, TRelated>
  localUpsert: UpsertOutput<TEntity>
}

export type Config<
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
> = {
  t: 'one-way-sync-remote-to-local'
  logger: ILogger
  kvDb: IKvDb
  remote: IDb.IDb<TEntity, TRelated>
  local: IDb.IDb<TEntity, TRelated>
  pubSub?: PubSub<Msg<TEntity, TRelated>>
  throttle: TimeSpan
  updateRelatedDbs?: (related: TRelated) => Promise<void>
}

export const Db = <
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
>(
  config: Config<TEntity, TRelated>
): IDb.IDb<TEntity, TRelated> => {
  const kvDb = KvDb({
    t: 'cached',
    source: config.kvDb,
    cache: KvDb({ t: 'hash-map', map: new Map() }),
  })

  const remoteToLocalSync = throttleByKeyDurable<[QueryInput<TEntity>]>({
    kvDb,
    timeSpan: config.throttle,
    getKey: (query) => `${TimeSpan.toMilliseconds(config.throttle)}_${toDeterministicHash(query)}`,
    fn: async (query) => {
      const remoteQueried = await config.remote.query(query)
      const entities = isOk(remoteQueried) ? remoteQueried.value.entities.items : []
      const localUpsert = await config.local.upsert({ entities: entities })

      if (isOk(remoteQueried) && remoteQueried.value.related) {
        await config.updateRelatedDbs?.(remoteQueried.value.related)
      }

      config.pubSub?.publish({
        t: 'synced-remote-to-local',
        remoteQuery: remoteQueried,
        localUpsert,
      })
    },
  })
  return {
    ...config.local,
    liveQuery(query) {
      remoteToLocalSync(query)
      return config.local.liveQuery(query)
    },
    async query(query) {
      await remoteToLocalSync(query)
      return config.local.query(query)
    },
  }
}
