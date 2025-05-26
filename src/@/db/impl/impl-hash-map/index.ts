import { ILogger } from '~/@/logger'
import { Paginated } from '~/@/pagination/paginated'
import { PubSub } from '~/@/pub-sub'
import { Ok } from '~/@/result'
import { IDb } from '../../interface'
import { QueryInput } from '../../interface/query-input/query-input'
import { QueryOutput } from '../../interface/query-output/query-output'
import { logSlowQuery } from '../shared/slow-query-logging'
import { Indexes } from './indexes'
import { queryMap } from './query-input-map'

export type Config<
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
> = {
  t: 'hash-map'
  parser: IDb.Parser<TEntity, TRelated>
  toPrimaryKey: (entity: TEntity) => string
  map?: (entity: TEntity) => TEntity
  getRelated: (entities: TEntity[]) => Promise<TRelated>
  logger: ILogger
}

const globalPubSub = PubSub<{ t: 'publish' }>()

export const Db = <
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
>(
  config: Config<TEntity, TRelated>
): IDb.IDb<TEntity, TRelated> => {
  const pubSubsByQueryKey = new Map<string, PubSub<QueryOutput<TEntity, TRelated>>>()
  const liveQueriesByQueryKey = new Map<string, QueryInput<TEntity>>()
  const entities = new Map<string, TEntity>()
  const indexes: Indexes = new Map()

  const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0))

  globalPubSub.subscribe(async (msg) => {
    switch (msg.t) {
      case 'publish': {
        for (const [queryKey, queryInput] of liveQueriesByQueryKey.entries()) {
          const queried = await query(queryInput)
          const existing = pubSubsByQueryKey.get(queryKey)
          if (!existing) continue
          existing.publish(queried)
          await nextTick()
        }
        return
      }
    }
  })

  const query = async (
    queryInput: QueryInput<TEntity>
  ): Promise<QueryOutput<TEntity, TRelated>> => {
    const startTime = performance.now()

    const queried = queryMap(entities, indexes, queryInput)

    const related = await config.getRelated(queried)

    const paginatedEntities: Paginated<TEntity> = {
      items: queried,
      total: queried.length,
      offset: queryInput.offset,
      limit: queryInput.limit,
    }

    const output: QueryOutput<TEntity, TRelated> = Ok({
      related,
      entities: paginatedEntities,
    })

    const endTime = performance.now()

    logSlowQuery({
      entityCount: entities.size,
      filteredCount: queried.length,
      logger: config.logger,
      query: queryInput,
      startTime,
      endTime,
    })
    return output
  }

  const enqueuePublish = async () => {
    await nextTick()
    globalPubSub.publish({ t: 'publish' })
  }
  return {
    // @ts-ignore
    entities,
    // @ts-ignore
    indexes,
    query,
    liveQuery(queryInput) {
      const queryKey = QueryInput.toKey(queryInput)
      liveQueriesByQueryKey.set(queryKey, queryInput)
      const existing = pubSubsByQueryKey.get(queryKey)
      if (existing) return existing
      const pubSub = PubSub<QueryOutput<TEntity, TRelated>>()
      pubSubsByQueryKey.set(queryKey, pubSub)
      console.log('pubSubsByQueryKey.size', pubSubsByQueryKey.size)
      enqueuePublish()
      return {
        ...pubSub,
        subscribe(callback) {
          const unsub = pubSub.subscribe(callback)
          return () => {
            unsub()
            if (pubSub.subscriberCount() === 0) {
              pubSubsByQueryKey.delete(queryKey)
              liveQueriesByQueryKey.delete(queryKey)
            }
          }
        },
      }
    },
    async upsert(input) {
      for (const unmappedEntity of input.entities) {
        const e = config.map ? config.map(unmappedEntity) : unmappedEntity
        const primaryKey = config.toPrimaryKey(e)
        entities.set(primaryKey, e)
        Indexes.populate(indexes, e, primaryKey)
      }
      enqueuePublish()
      return Ok({
        entities: input.entities,
      })
    },
  }
}
