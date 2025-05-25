import { Db } from '~/@/db/impl/impl'
import { IMediaDb } from '../interface/interface'
import { ILogger } from '~/@/logger'

export type Config = {
  t: 'hash-map'
  logger: ILogger
}

export const MediaDb = (config: Config): IMediaDb => {
  return Db({
    t: 'hash-map',
    parser: IMediaDb.parser,
    toPrimaryKey: (entity) => entity.id,
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
