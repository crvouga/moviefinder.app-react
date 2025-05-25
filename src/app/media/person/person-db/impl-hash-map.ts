import { Db } from '~/@/db/impl/impl'
import { IPersonDb } from './interface'

export type Config = {
  t: 'hash-map'
}

export const PersonDb = (_config: Config): IPersonDb => {
  return Db({
    t: 'hash-map',
    parser: IPersonDb.parser,
    toPrimaryKey: (entity) => entity.id,
    getRelated: async (_entities) => ({}),
  })
}
