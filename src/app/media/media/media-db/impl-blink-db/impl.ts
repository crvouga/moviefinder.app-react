import { Database } from 'blinkdb'
import { Db } from '~/@/db/impl/impl'
import { ILogger } from '~/@/logger'
import { IMediaDb } from '../interface/interface'

export type Config = {
  t: 'blink-db'
  logger: ILogger
  blinkDb: Database
}

export const MediaDb = (config: Config): IMediaDb => {
  return Db({
    t: 'blink-db',
    parser: IMediaDb.parser,
    db: config.blinkDb,
    tableName: 'media',
    primaryKey: 'id',
    indexes: ['id', 'title', 'releaseDate', 'popularity'],
    getRelated: async (_entities) => ({
      credit: {},
      person: {},
      relationship: {},
      media: {},
      video: {},
    }),
    logger: config.logger,
  })
}
