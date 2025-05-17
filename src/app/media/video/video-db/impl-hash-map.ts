import { createDbFromHashMap } from '~/@/db/impl/create-db-from-hash-map'
import { IVideoDb } from './interface'

export type Config = {
  t: 'hash-map'
}

export const VideoDb = (_config: Config): IVideoDb => {
  return createDbFromHashMap({
    parser: IVideoDb.parser,
    entities: new Map(),
    indexes: new Map(),
    toPrimaryKey: (entity) => entity.id,
    getRelated: async () => ({}),
  })
}
