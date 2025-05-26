import { Database } from 'blinkdb'
import { Db } from '~/@/db/impl/impl'
import { ILogger } from '~/@/logger'
import { IPersonDb } from './interface'

export type Config = {
  t: 'blink-db'
  blinkDb: Database
  logger: ILogger
}

export const PersonDb = (config: Config): IPersonDb => {
  return Db({
    t: 'blink-db',
    parser: IPersonDb.parser,
    db: config.blinkDb,
    tableName: 'person',
    primaryKey: 'id',
    indexes: ['id', 'name', 'popularity'],
    logger: config.logger,
    getRelated: async (_entities) => ({}),
  })
}
