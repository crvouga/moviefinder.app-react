import { Db } from '~/@/db/impl/impl'
import { IMediaDb } from '../interface/interface'

export type Config = {
  t: 'hash-map'
}

export const MediaDb = (_config: Config): IMediaDb => {
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
  })
}
