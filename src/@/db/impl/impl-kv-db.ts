import { z } from 'zod'
import { Codec } from '~/@/codec'
import { KvDb } from '~/@/kv-db/impl'
import { IKvDb } from '~/@/kv-db/interface'
import { Pagination } from '~/@/pagination/pagination'
import { PubSub } from '~/@/pub-sub'
import { Ok, unwrapOr } from '~/@/result'
import { IDb } from '../interface'
import { OrderBy } from '../interface/query-input/order-by'
import { QueryInput } from '../interface/query-input/query-input'
import { Where } from '../interface/query-input/where'
import { QueryOutput } from '../interface/query-output/query-output'

export type Config<
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
> = {
  t: 'kv-db'
  parser: IDb.Parser<TEntity, TRelated>
  kvDb: IKvDb
  namespace: string[]
  toPrimaryKey: (entity: TEntity) => string
  getRelated: (entities: TEntity[]) => Promise<TRelated>
}

export const Db = <
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
>(
  config: Config<TEntity, TRelated>
): IDb.IDb<TEntity, TRelated> => {
  const pubSubsByQueryKey = new Map<string, PubSub<QueryOutput<TEntity, TRelated>>>()
  const liveQueriesByQueryKey = new Map<string, QueryInput<TEntity>>()

  const entitiesKv = KvDb({
    t: 'namespaced',
    kvDb: config.kvDb,
    namespace: [...config.namespace, 'entities'],
  })

  const allIdsKv = KvDb({
    t: 'namespaced',
    kvDb: config.kvDb,
    namespace: [...config.namespace, 'allIds'],
  })

  const getAllIds = async (): Promise<string[]> => {
    return (
      unwrapOr(await allIdsKv.get(Codec.fromZod(z.array(z.string())), ['all']), () => [])[0] ?? []
    )
  }

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
    const allIds = await getAllIds()

    const entities = unwrapOr(
      await entitiesKv.get(Codec.fromZod(config.parser.Entity), allIds),
      () => []
    )
    const filtered = queryInput.where ? Where.filter(entities, queryInput.where) : entities
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
      const entities = input.entities.map((e): [string, TEntity] => [config.toPrimaryKey(e), e])
      await entitiesKv.set(Codec.fromZod(config.parser.Entity), ...entities)
      const allIds = await getAllIds()
      const allIdsNew = Array.from(new Set([...allIds, ...entities.map(([k]) => k)]))
      await allIdsKv.set(Codec.fromZod(z.array(z.string())), ['all', allIdsNew])

      publish()
      return Ok({
        entities: input.entities,
      })
    },
  }
}
