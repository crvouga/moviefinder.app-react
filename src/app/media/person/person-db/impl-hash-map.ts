import { createDbFromHashMap } from '~/@/db/impl/create-db-from-hash-map'
import { IPersonDb } from './interface'

export type Config = {
  t: 'hash-map'
}

export const PersonDb = (_config: Config): IPersonDb => {
  return createDbFromHashMap({
    parser: IPersonDb.parser,
    entities: new Map(),
    indexes: new Map(),
    toPrimaryKey: (entity) => entity.id,
    getRelated: async (_entities) => ({}),
  })
}
