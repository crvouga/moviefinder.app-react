import { Err, Ok, Result } from '~/@/result'
import { DbConnParam, IDbConn } from '../interface'
import { z } from 'zod'
import { Pglite } from '~/@/pglite/pglite'
import { PubSub, Sub } from '~/@/pub-sub'
import { ILogger, Logger } from '~/@/logger'

export type Config = {
  t: 'pglite'
  pglite: Pglite
  logger: ILogger
}

export const DbConn = (config: Config): IDbConn => {
  const logger = Logger.prefix('pglite', config.logger)

  return {
    async query(input) {
      try {
        logger.info('query', { sql: input.sql, params: input.params })
        const { rows } = await config.pglite.query(input.sql, input.params)

        if (input.limit !== undefined) {
          rows.splice(input.limit)
        }

        if (input.offset !== undefined) {
          rows.splice(0, input.offset)
        }

        const parser = input.parser ?? z.unknown()

        const parsedRows = rows.map((row) => parser.parse(row))

        return Ok({ rows: parsedRows })
      } catch (error) {
        logger.error('query', { error, sql: input.sql, params: input.params })
        return Err(error instanceof Error ? error : new Error(String(error)))
      }
    },
    liveQuery<TRow>(input: {
      parser: z.ZodType<TRow>
      sql: string
      params?: DbConnParam[]
      limit?: number
      offset?: number
    }): Sub<Result<{ rows: TRow[] }, Error>> {
      logger.info('liveQuery', { sql: input.sql, params: input.params })
      const sub = PubSub<Result<{ rows: TRow[] }, Error>>()

      try {
        const ret = config.pglite.live.query({
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
            return sub.publish(result)
          },
        })

        return {
          ...sub,
          subscribe(callback) {
            const unsubscribe = sub.subscribe(callback)
            return () => {
              unsubscribe()
              ret.then((r) => r.unsubscribe())
            }
          },
        }
      } catch (error) {
        logger.error('liveQuery', { error, sql: input.sql, params: input.params })
        return sub
      }
    },
  }
}
