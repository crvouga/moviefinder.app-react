import { Err, Ok, Result } from '~/@/result'
import { DbConnParam, IDbConn } from '../interface'
import { z } from 'zod'
import { Pglite } from '~/@/pglite/pglite'
import { PubSub, Sub } from '~/@/pub-sub'

export type Config = {
  t: 'pglite'
  pglite: Pglite
}

export const DbConn = (config: Config): IDbConn => {
  return {
    async query(input) {
      try {
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
      const sub = PubSub<Result<{ rows: TRow[] }, Error>>()

      const ret = config.pglite.live.query({
        query: input.sql,
        params: input.params,
        limit: input.limit,
        offset: input.offset,
        callback: (pgResult) => {
          const parsedRows = pgResult.rows.map((row) => input.parser.parse(row))
          const result = Ok({ rows: parsedRows })
          return sub.publish(result)
        },
      })

      return {
        subscribe(callback) {
          const unsubscribe = sub.subscribe(callback)
          return () => {
            unsubscribe()
            ret.then((r) => r.unsubscribe())
          }
        },
      }
    },
  }
}
