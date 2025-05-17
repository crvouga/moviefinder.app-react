import { Db } from '~/@/db/impl/impl'
import { isErr } from '~/@/result'
import { IMediaDb } from '../../media/media-db/interface/interface'
import { IRelationshipDb } from './interface'

export type Config = {
  t: 'hash-map'
  mediaDb: IMediaDb
}

export const RelationshipDb = (config: Config): IRelationshipDb => {
  return Db({
    t: 'hash-map',
    parser: IRelationshipDb.parser,
    entities: new Map(),
    indexes: new Map(),
    toPrimaryKey: (entity) => entity.id,
    getRelated: async (entities) => {
      const media = await config.mediaDb.query({
        limit: Math.max(entities.length, 1),
        offset: 0,
        where: {
          op: 'in',
          column: 'id',
          value: entities.map((e) => e.to),
        },
        orderBy: [{ column: 'id', direction: 'asc' }],
      })
      if (isErr(media)) return { media: {} }

      const mediaMap = Object.fromEntries(media.value.entities.items.map((m) => [m.id, m]))

      return {
        media: mediaMap,
      }
    },
  })
}
