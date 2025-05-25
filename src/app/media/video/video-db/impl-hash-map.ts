import { Db } from '~/@/db/impl/impl'
import { IVideoDb } from './interface'

export type Config = {
  t: 'hash-map'
}

export const VideoDb = (_config: Config): IVideoDb => {
  return Db({
    t: 'hash-map',
    parser: IVideoDb.parser,
    toPrimaryKey: (entity) => entity.id,
    getRelated: async () => ({}),
  })
}
