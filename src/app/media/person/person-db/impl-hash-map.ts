import { Db } from '~/@/db/impl/impl'
import { ILogger } from '~/@/logger'
import { IPersonDb } from './interface'

export type Config = {
  t: 'hash-map'
  logger: ILogger
}

export const PersonDb = (config: Config): IPersonDb => {
  return Db({
    t: 'hash-map',
    parser: IPersonDb.parser,
    toPrimaryKey: (entity) => entity.id,
    getRelated: async (_entities) => ({}),
    logger: config.logger,
  })
}
