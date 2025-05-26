import { Db } from '~/@/db/impl/impl'
import { isErr } from '~/@/result'
import { IMediaDb } from '../../media/media-db/interface/interface'
import { ILogger } from '~/@/logger'
import { IRelationshipDb } from './interface'
import { Database } from 'blinkdb'

export type Config = {
  t: 'blink-db'
  mediaDb: IMediaDb
  logger: ILogger
  blinkDb: Database
}

export const RelationshipDb = (config: Config): IRelationshipDb => {
  return Db({
    t: 'blink-db',
    parser: IRelationshipDb.parser,
    db: config.blinkDb,
    tableName: 'relationship',
    primaryKey: 'id',
    indexes: ['from', 'to'],
    logger: config.logger,
    async getRelated(entities) {
      const media = await config.mediaDb.query({
        limit: Math.max(entities.length, 1),

        offset: 0,
        where: { op: 'in', column: 'id', value: entities.map((e) => e.to) },
        orderBy: [{ column: 'id', direction: 'asc' }],
      })

      if (isErr(media)) return { media: {} }

      const mediaMap = Object.fromEntries(media.value.entities.items.map((m) => [m.id, m]))

      return { media: mediaMap }
    },
  })
}
