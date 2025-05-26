import { Database } from 'blinkdb'
import { Db } from '~/@/db/impl/impl'
import { ILogger } from '~/@/logger'
import { IVideoDb } from './interface'

export type Config = {
  t: 'blink-db'
  logger: ILogger
  blinkDb: Database
}

export const VideoDb = (config: Config): IVideoDb => {
  return Db({
    t: 'blink-db',
    parser: IVideoDb.parser,
    db: config.blinkDb,
    tableName: 'video',
    primaryKey: 'id',
    indexes: ['id', 'mediaId'],
    getRelated: async () => ({}),
    logger: config.logger,
  })
}
