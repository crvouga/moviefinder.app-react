import { Pagination } from '~/@/pagination/pagination'
import { PubSub } from '~/@/pub-sub'
import { Ok } from '~/@/result'
import { Db } from '../interface'
import { OrderBy } from '../interface/query-input/order-by'
import { QueryInput } from '../interface/query-input/query-input'
import { Where } from '../interface/query-input/where'
import { QueryOutput } from '../interface/query-output/query-output'

export type Config<
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
> = {
  parser: Db.Parser<TEntity, TRelated>
  entities: Map<string, TEntity>
  indexes: Map<string, string[]>
  toPrimaryKey: (entity: TEntity) => string
  getRelated: (entities: TEntity[]) => Promise<TRelated>
}

export const createDbFromHashMap = <
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
>(
  config: Config<TEntity, TRelated>
): Db.Db<TEntity, TRelated> => {
  const pubSubsByQueryKey = new Map<string, PubSub<QueryOutput<TEntity, TRelated>>>()
  const liveQueriesByQueryKey = new Map<string, QueryInput<TEntity>>()

  const publish = async () => {
    for (const [key, queryInput] of liveQueriesByQueryKey.entries()) {
      const queried = await query(queryInput)
      const existing = pubSubsByQueryKey.get(key)
      if (!existing) continue
      existing.publish(queried)
    }
  }
  const query = async (
    queryInput: QueryInput<TEntity>
  ): Promise<QueryOutput<TEntity, TRelated>> => {
    const all = Array.from(config.entities.values())
    const filtered = queryInput.where ? Where.filter(all, queryInput.where) : all
    const sorted = queryInput.orderBy ? OrderBy.sort(filtered, queryInput.orderBy) : filtered
    const paginated = Pagination.paginate(sorted, queryInput)
    return Ok({
      related: await config.getRelated(paginated),
      entities: {
        items: paginated,
        total: filtered.length,
        offset: queryInput.offset,
        limit: queryInput.limit,
      },
    })
  }
  return {
    query,
    liveQuery(queryInput) {
      const queryKey = QueryInput.toKey(queryInput)
      liveQueriesByQueryKey.set(queryKey, queryInput)
      const existing = pubSubsByQueryKey.get(queryKey)

      if (existing) return existing

      const pubSub = PubSub<QueryOutput<TEntity, TRelated>>()
      pubSubsByQueryKey.set(queryKey, pubSub)
      publish()
      return pubSub
    },
    async upsert(input) {
      for (const e of input.entities) {
        config.entities.set(config.toPrimaryKey(e), e)
      }
      publish()
      return Ok({
        entities: input.entities,
      })
    },
  }
}
