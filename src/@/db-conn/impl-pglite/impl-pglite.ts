import { PGlite } from '@electric-sql/pglite'
import { Err, Ok } from '~/@/result'
import { IDbConn } from '../interface'
import { z } from 'zod'

export type Config = {
  t: 'pglite'
  pglite: PGlite
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
  }
}
