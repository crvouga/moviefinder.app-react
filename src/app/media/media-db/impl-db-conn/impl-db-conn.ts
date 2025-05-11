import { z } from 'zod'
import { IDbConn } from '~/@/db-conn/interface'
import { IMediaDb } from '../interface'

export type Config = {
  t: 'db-conn'
  dbConn: IDbConn
  shouldCreateTable?: boolean
}

export const MediaDb = (config: Config): IMediaDb => {
  if (config.shouldCreateTable) {
    config.dbConn.query({
      sql: `
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
      )
    `,
      params: [],
      parser: z.unknown(),
    })
  }

  return {
    async query(_query) {
      throw new Error('Not implemented')
    },
  }
}
