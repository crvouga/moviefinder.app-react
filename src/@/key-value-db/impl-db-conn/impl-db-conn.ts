import { z } from 'zod'
import { IDbConn } from '~/@/db-conn/interface'
import { isErr, Ok } from '~/@/result'
import { IKeyValueDb } from '../interface'

export type Config = {
  t: 'db-conn'
  dbConn: IDbConn
  shouldMigrateUp: boolean
}

const UP = `
CREATE TABLE IF NOT EXISTS key_value (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at_posix REAL NOT NULL,
  updated_at_posix REAL,
  deleted_at_posix REAL
)
`

export const KeyValueDb = (config: Config): IKeyValueDb => {
  if (config.shouldMigrateUp) {
    config.dbConn.query({ sql: UP, params: [], parser: z.unknown() })
  }

  return {
    async get(codec, key) {
      const result = await config.dbConn.query({
        sql: 'SELECT value FROM key_value WHERE key = $1 AND deleted_at_posix IS NULL',
        params: [key],
        parser: z.object({ value: z.string() }),
      })

      if (isErr(result)) return result

      const value = result.value.rows[0]?.value ?? null

      const decoded = value ? codec.decode(value) : null

      return Ok(decoded)
    },
    async set(codec, key, value) {
      const encoded = codec.encode(value)

      const result = await config.dbConn.query({
        sql: 'INSERT INTO key_value (key, value, created_at_posix) VALUES ($1, $2, $3) ON CONFLICT(key) DO UPDATE SET value = $2, updated_at_posix = $3, deleted_at_posix = NULL',
        params: [key, encoded, Date.now()],
        parser: z.unknown(),
      })

      if (isErr(result)) return result

      return Ok(null)
    },
    async zap(key) {
      const result = await config.dbConn.query({
        sql: 'UPDATE key_value SET deleted_at_posix = $1 WHERE key = $2',
        params: [Date.now(), key],
        parser: z.unknown(),
      })

      if (isErr(result)) return result

      return Ok(null)
    },
  }
}
