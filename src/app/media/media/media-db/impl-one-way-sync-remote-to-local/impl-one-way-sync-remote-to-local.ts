import { Db } from '~/@/db/impl/impl'
import { OneWaySyncRemoteToLocal } from '~/@/db/impl/impl-one-way-sync-remote-to-local'
import { ICreditDb } from '~/app/media/credit/credit-db/interface'
import { IPersonDb } from '~/app/media/person/person-db/interface'
import { IRelationshipDb } from '~/app/media/relationship/relationship-db/interface'
import { IVideoDb } from '~/app/media/video/video-db/interface'
import { Media } from '../../media'
import { IMediaDb, MediaRelated } from '../interface/interface'

export type OneWaySyncRemoteToLocalMsg = OneWaySyncRemoteToLocal.Msg<Media, MediaRelated>

export type Config = OneWaySyncRemoteToLocal.Config<Media, MediaRelated> & {
  relatedDbs: {
    creditDb: ICreditDb
    relationshipDb: IRelationshipDb
    videoDb: IVideoDb
    personDb: IPersonDb
    mediaDb: IMediaDb
  }
}

export const MediaDb = (config: Config): IMediaDb => {
  return Db({
    ...config,
    async updateRelatedDbs(related) {
      await Promise.all([
        config.relatedDbs.creditDb.upsert({ entities: Object.values(related.credit) }),
        config.relatedDbs.relationshipDb.upsert({ entities: Object.values(related.relationship) }),
        config.relatedDbs.videoDb.upsert({ entities: Object.values(related.video) }),
        config.relatedDbs.personDb.upsert({ entities: Object.values(related.person) }),
        config.relatedDbs.mediaDb.upsert({ entities: Object.values(related.media) }),
      ])
    },
  })
}
