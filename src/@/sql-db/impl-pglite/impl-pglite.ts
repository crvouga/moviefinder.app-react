import type { LiveQuery } from '@electric-sql/pglite/live'
import { z } from 'zod'
import { ILogger, Logger } from '~/@/logger'
import { PgliteInstance, PgliteWorkerInstance } from '~/@/pglite/types'
import { PubSub, Sub } from '~/@/pub-sub'
import { Err, Ok, Result } from '~/@/result'
import { ISqlDb } from '~/@/sql-db/interface'
import { SqlDbParam } from '~/@/sql-db/sql-db-param'

export type Config = {
  t: 'pglite'
  pglite: Promise<PgliteInstance | PgliteWorkerInstance>
  logger: ILogger
}

export const SqlDb = (config: Config): ISqlDb => {
  const logger = Logger.prefix('pglite', config.logger)

  return {
    async query(input) {
      try {
        const start = performance.now()
        const pglite = await config.pglite
        const { rows } = await pglite.query(input.sql, input.params)
        const end = performance.now()

        if (input.limit !== undefined) {
          rows.splice(input.limit)
        }

        if (input.offset !== undefined) {
          rows.splice(0, input.offset)
        }

        const parser = input.parser ?? z.unknown()

        const parsedRows = rows.map((row) => parser.parse(row))

        const duration = end - start
        const durationStr = `${duration.toFixed(2)}ms`
        logger.info('query', durationStr, input.sql, input.params, parsedRows)

        return Ok({ rows: parsedRows })
      } catch (error) {
        logger.error('query', { error, sql: input.sql, params: input.params })
        return Err(error instanceof Error ? error : new Error(String(error)))
      }
    },
    liveQuery<TRow>(input: {
      parser: z.ZodType<TRow>
      sql: string
      params?: SqlDbParam[]
      limit?: number
      offset?: number
      waitFor?: Promise<unknown>
    }): Sub<Result<{ rows: TRow[] }, Error>> {
      logger.info('liveQuery', input.sql, input.params)
      const pubSub = PubSub<Result<{ rows: TRow[] }, Error>>()

      try {
        let ret: Promise<LiveQuery<{ [key: string]: any }>> | undefined

        config.pglite.then(async (pglite) => {
          await (input.waitFor ?? Promise.resolve())
          ret = pglite.live.query({
            query: input.sql,
            params: input.params,
            limit: input.limit,
            offset: input.offset,
            callback: (pgResult) => {
              const parsedRows = pgResult.rows.flatMap((row) => {
                const parsed = input.parser.safeParse(row)
                if (parsed.success) {
                  return parsed.data
                }
                logger.error('liveQuery', { error: parsed.error, row })
                return []
              })
              const result = Ok({ rows: parsedRows })
              return pubSub.publish(result)
            },
          })
        })

        return {
          ...pubSub,
          subscribe(callback) {
            const unsubscribe = pubSub.subscribe(callback)
            return () => {
              unsubscribe()
              ret?.then((r) => r.unsubscribe())
            }
          },
        }
      } catch (error) {
        logger.error('liveQuery', { error, sql: input.sql, params: input.params })
        return pubSub
      }
    },
  }
}
