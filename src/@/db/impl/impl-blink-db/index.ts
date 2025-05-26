import {
  Query as BlinkQuery,
  Where as BlinkWhere,
  count,
  createTable,
  Database,
  many,
  upsertMany,
} from 'blinkdb'
import { ILogger } from '~/@/logger'
import { PubSub } from '~/@/pub-sub'
import { Ok } from '~/@/result'
import { IDb } from '../../interface'
import { QueryInput } from '../../interface/query-input/query-input'
import { Where } from '../../interface/query-input/where'
import { QueryOutput } from '../../interface/query-output/query-output'
import { logSlowQuery } from '../shared/slow-query-logging'

const toBlinkWhere = <TEntity extends Record<string, unknown>>(
  where: Where<TEntity>
): BlinkWhere<TEntity> => {
  switch (where.op) {
    case '=': {
      // @ts-ignore
      const blinkWhere: BlinkWhere<TEntity> = {
        [where.column]: {
          eq: where.value,
        },
      }
      return blinkWhere
    }
    case 'and': {
      // @ts-ignore
      const blinkWhere: BlinkWhere<TEntity> = {
        AND: where.clauses.map(toBlinkWhere),
      }
      return blinkWhere
    }
    case 'in': {
      // @ts-ignore
      const blinkWhere: BlinkWhere<TEntity> = {
        [where.column]: {
          in: where.value,
        },
      }
      return blinkWhere
    }
  }
}

const toBlinkQuery = <TEntity extends Record<string, unknown>>(
  queryInput: QueryInput<TEntity>
): BlinkQuery<TEntity, any> => {
  return {
    limit: {
      skip: queryInput.offset,
      take: queryInput.limit,
    },
    where: queryInput.where ? toBlinkWhere(queryInput.where) : undefined,
  }
}

export type Config<
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
> = {
  t: 'blink-db'
  db: Database
  tableName: string
  primaryKey: keyof TEntity
  indexes: (keyof TEntity)[]
  parser: IDb.Parser<TEntity, TRelated>
  getRelated: (entities: TEntity[]) => Promise<TRelated>
  logger: ILogger
  map?: (entity: TEntity) => TEntity
}

export const SLOW_QUERY_THRESHOLD = 1
const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0))

const globalPubSub = PubSub<{ t: 'publish' }>()
export const Db = <
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
>(
  config: Config<TEntity, TRelated>
): IDb.IDb<TEntity, TRelated> => {
  const pubSubsByQueryKey = new Map<string, PubSub<QueryOutput<TEntity, TRelated>>>()
  const liveQueriesByQueryKey = new Map<string, QueryInput<TEntity>>()
  const Table = createTable<TEntity>(config.db, config.tableName)
  const table = Table({
    primary: config.primaryKey as any,
    indexes: config.indexes as any,
  })
  const entityIds = new Set<unknown>()

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
    const blinkQuery = toBlinkQuery(queryInput)

    const [result, total] = await Promise.all([
      many(table as any, blinkQuery),
      count(table as any, blinkQuery),
    ])

    const output: QueryOutput<TEntity, TRelated> = Ok({
      entities: {
        items: result,
        total,
        offset: queryInput.offset,
        limit: queryInput.limit,
      },
      related: await config.getRelated(result),
    })
    const endTime = performance.now()
    logSlowQuery({
      entityCount: entityIds.size,
      filteredCount: result.length,
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
    query,
    liveQuery(queryInput) {
      const queryKey = QueryInput.toKey(queryInput)
      liveQueriesByQueryKey.set(queryKey, queryInput)
      const existing = pubSubsByQueryKey.get(queryKey)
      if (existing) return existing
      const pubSub = PubSub<QueryOutput<TEntity, TRelated>>()
      pubSubsByQueryKey.set(queryKey, pubSub)
      enqueuePublish()
      return pubSub
    },
    async upsert(input) {
      await upsertMany(
        // @ts-ignore
        table,
        input.entities
      )
      for (const entity of input.entities) {
        entityIds.add(entity[config.primaryKey])
      }
      enqueuePublish()
      return Ok({
        entities: input.entities,
      })
    },
  }
}
