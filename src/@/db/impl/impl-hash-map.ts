import { Paginated } from '~/@/pagination/paginated'
import { Pagination } from '~/@/pagination/pagination'
import { PubSub } from '~/@/pub-sub'
import { Ok } from '~/@/result'
import { IDb } from '../interface'
import { OrderBy } from '../interface/query-input/order-by'
import { QueryInput } from '../interface/query-input/query-input'
import { Where } from '../interface/query-input/where'
import { QueryOutput } from '../interface/query-output/query-output'

export type Config<
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
> = {
  t: 'hash-map'
  parser: IDb.Parser<TEntity, TRelated>
  toPrimaryKey: (entity: TEntity) => string
  map?: (entity: TEntity) => TEntity
  getRelated: (entities: TEntity[]) => Promise<TRelated>
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

  // map of primary key -> entity
  const entities = new Map<string, TEntity>()
  // map of entity fields -> map of field values -> set of primary keys
  const indexes = new Map<string, Map<string, Set<string>>>()

  globalPubSub.subscribe(async (msg) => {
    switch (msg.t) {
      case 'publish': {
        for (const [queryKey, queryInput] of liveQueriesByQueryKey.entries()) {
          const queried = await query(queryInput)
          const existing = pubSubsByQueryKey.get(queryKey)
          if (!existing) continue
          existing.publish(queried)
        }
        return
      }
    }
  })

  const query = async (
    queryInput: QueryInput<TEntity>
  ): Promise<QueryOutput<TEntity, TRelated>> => {
    const start = performance.now()
    const all = entities

    const filtered: Map<string, TEntity> = queryInput.where
      ? Where.filterMap(all, indexes, queryInput.where)
      : all

    const sorted: TEntity[] = queryInput.orderBy
      ? OrderBy.sortMap(filtered, indexes, queryInput.orderBy)
      : Array.from(filtered.values())

    const paginated = Pagination.paginate(sorted, queryInput)

    const related = await config.getRelated(paginated)

    const paginatedEntities: Paginated<TEntity> = {
      items: paginated,
      total: filtered.size,
      offset: queryInput.offset,
      limit: queryInput.limit,
    }

    const output: QueryOutput<TEntity, TRelated> = Ok({
      related,
      entities: paginatedEntities,
    })
    const end = performance.now()
    const duration = end - start
    if (duration > 1) {
      console.log(`query took: ${duration.toFixed(2)} ms, scanned: ${all.size} records`, queryInput)
    }
    return output
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
      globalPubSub.publish({ t: 'publish' })
      return pubSub
    },
    async upsert(input) {
      for (const unmappedEntity of input.entities) {
        const e = config.map ? config.map(unmappedEntity) : unmappedEntity

        const primaryKey = config.toPrimaryKey(e)

        entities.set(primaryKey, e)

        for (const key in e) {
          if (!indexes.has(key)) {
            indexes.set(key, new Map())
          }

          const valueIndexes = indexes.get(key)

          const value = e[key]

          if (!valueIndexes) throw new Error('valueIndexes is undefined')

          const valueKey = String(value)

          if (!valueIndexes.has(valueKey)) {
            valueIndexes.set(valueKey, new Set())
          }

          valueIndexes.get(valueKey)?.add(primaryKey)
        }
      }
      globalPubSub.publish({ t: 'publish' })
      return Ok({
        entities: input.entities,
      })
    },
  }
}
