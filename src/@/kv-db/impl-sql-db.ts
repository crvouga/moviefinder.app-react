import { z } from 'zod'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { isErr, Ok } from '~/@/result'
import { ISqlDb } from '~/@/sql-db/interface'
import { toBulkInsertSql } from '../sql/bulk-insert'
import { IKvDb } from './interface'

export type Config = {
  t: 'sql-db'
  sqlDb: ISqlDb
  migrationPolicy: IMigrationPolicy
}

const up = `
CREATE TABLE IF NOT EXISTS key_value (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at_posix REAL NOT NULL,
  updated_at_posix REAL,
  deleted_at_posix REAL
)
`
const down = `
DROP TABLE IF EXISTS key_value CASCADE
`

export const KvDb = (config: Config): IKvDb => {
  const run = config.migrationPolicy.run({ sqlDb: config.sqlDb, up: [up], down: [down] })
  return {
    async get(codec, keys) {
      await run
      const result = await config.sqlDb.query({
        sql: `SELECT value FROM key_value WHERE key IN (${keys.map((k) => `'${k}'`).join(',')}) AND deleted_at_posix IS NULL`,
        params: [],
        parser: z.object({ value: z.string() }),
      })

      if (isErr(result)) return result

      const values = result.value.rows.flatMap((row) => {
        if (!row.value) return []
        const decoded = codec.decode(row.value)
        if (!decoded) return []
        return [decoded]
      })

      return Ok(values)
    },
    async set(codec, ...entries) {
      await run
      const now = Date.now()
      const params = entries.map(([key, value]) => [key, codec.encode(value), now])

      const { params: flatParams, variables } = toBulkInsertSql({
        params,
      })

      const result = await config.sqlDb.query({
        sql: `INSERT INTO key_value (key, value, created_at_posix) 
              VALUES ${variables} 
              ON CONFLICT(key) DO UPDATE 
              SET value = EXCLUDED.value, 
                  updated_at_posix = EXCLUDED.created_at_posix, 
                  deleted_at_posix = NULL`,
        params: flatParams,
        parser: z.unknown(),
      })

      if (isErr(result)) return result

      return Ok(null)
    },
    async zap(keys) {
      await run
      const result = await config.sqlDb.query({
        sql: `UPDATE key_value SET deleted_at_posix = ${Date.now()} WHERE key IN (${keys.map((k) => `'${k}'`).join(',')})`,
        params: [],
        parser: z.unknown(),
      })

      if (isErr(result)) return result

      return Ok(null)
    },
  }
}
