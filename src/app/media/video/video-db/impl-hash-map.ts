import { Db } from '~/@/db/impl/impl'
import { ILogger } from '~/@/logger'
import { IVideoDb } from './interface'

export type Config = {
  t: 'hash-map'
  logger: ILogger
}

export const VideoDb = (config: Config): IVideoDb => {
  return Db({
    t: 'hash-map',
    parser: IVideoDb.parser,
    toPrimaryKey: (entity) => entity.id,
    getRelated: async () => ({}),
    logger: config.logger,
  })
}
