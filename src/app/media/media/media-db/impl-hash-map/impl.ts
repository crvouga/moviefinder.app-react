import { createDbFromHashMap } from '~/@/db/impl/create-db-from-hash-map'
import { IMediaDb } from '../interface/interface'

export type Config = {
  t: 'hash-map'
}

export const MediaDb = (_config: Config): IMediaDb => {
  return createDbFromHashMap({
    parser: IMediaDb.parser,
    entities: new Map(),
    indexes: new Map(),
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
