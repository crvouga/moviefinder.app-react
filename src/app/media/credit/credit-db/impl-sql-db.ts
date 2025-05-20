import { z } from 'zod'
import { Db } from '~/@/db/impl/impl'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { NonEmpty } from '~/@/non-empty'
import { isOk } from '~/@/result'
import { ISqlDb } from '~/@/sql-db/interface'
import { MediaId } from '../../media/media-id'
import { Person } from '../../person/person'
import { IPersonDb } from '../../person/person-db/interface'
import { PersonId } from '../../person/person-id'
import { CreditId } from '../credit-id'
import { ICreditDb } from './interface'
import { exhaustive } from '~/@/exhaustive-check'

export type Config = {
  t: 'sql-db'
  sqlDb: ISqlDb
  logger: ILogger
  kvDb: IKvDb
  personDb: IPersonDb
}

const up = [
  `CREATE TYPE credit_type AS ENUM ('cast', 'crew')`,
  `
CREATE TABLE IF NOT EXISTS credit (
    id TEXT PRIMARY KEY,
    media_id TEXT NOT NULL,
    person_id TEXT NOT NULL,
    job TEXT,
    character TEXT,
    "order" INTEGER,
    type credit_type NOT NULL,
    computed_is_director BOOLEAN GENERATED ALWAYS AS (COALESCE(job ILIKE 'director', false)) STORED NOT NULL,
    computed_is_cast BOOLEAN GENERATED ALWAYS AS (type = 'cast') STORED NOT NULL
)
`,
]

const down = [
  `
DROP TABLE IF EXISTS credit CASCADE;
`,
  `
DROP TYPE IF EXISTS credit_type CASCADE;
`,
]

const CreditTypePostgres = z.enum(['cast', 'crew'])

export const CreditDb = (config: Config): ICreditDb => {
  return Db({
    t: 'sql-db',
    getRelated: async (entities) => {
      if (!NonEmpty.is(entities)) {
        return { person: {} }
      }
      const personQueried = await config.personDb.query({
        limit: 1000,
        offset: 0,
        where: {
          op: 'in',
          column: 'id',
          value: NonEmpty.map(entities, (entity) => entity.personId),
        },
      })
      if (!isOk(personQueried)) return { person: {} }

      const personMap: Record<PersonId, Person> = {}
      for (const person of personQueried.value.entities.items) {
        personMap[PersonId.fromString(person.id)] = person
      }

      return {
        person: personMap,
      }
    },
    parser: ICreditDb.parser,
    sqlDb: config.sqlDb,
    viewName: 'credit',
    migration: {
      policy: MigrationPolicy({
        t: 'dangerously-wipe-on-new-schema',
        logger: config.logger,
        kvDb: config.kvDb,
      }),
      up,
      down,
    },
    rowParser: z.object({
      id: z.string(),
      media_id: z.string(),
      person_id: z.string(),
      job: z.string().nullable(),
      character: z.string().nullable(),
      order: z.number().nullable(),
      type: CreditTypePostgres,
      computed_is_director: z.boolean().nullable(),
      computed_is_cast: z.boolean().nullable(),
    }),
    rowToEntity(row) {
      return {
        id: CreditId.fromString(row.id),
        mediaId: MediaId.fromString(row.media_id),
        personId: PersonId.fromString(row.person_id),
        job: row.job,
        character: row.character,
        order: row.order,
        type: row.type,
        computedIsDirector: row.computed_is_director,
        computedIsCast: row.computed_is_cast,
      }
    },
    computedColumnKeys: ['computed_is_director', 'computed_is_cast'],
    entityKeyToSqlColumn: (field) => {
      switch (field) {
        case 'id':
          return 'id'
        case 'mediaId':
          return 'media_id'
        case 'personId':
          return 'person_id'
        case 'job':
          return 'job'
        case 'character':
          return 'character'
        case 'order':
          return 'order'
        case 'type':
          return 'type'
        case 'computedIsDirector':
          return 'computed_is_director'
        case 'computedIsCast':
          return 'computed_is_cast'
        default:
          return exhaustive(field)
      }
    },
    primaryKey: 'id',
    entityToRow(entity) {
      return {
        id: entity.id,
        media_id: entity.mediaId,
        person_id: entity.personId,
        job: entity.job,
        character: entity.character,
        order: entity.order,
        type: entity.type,
        computed_is_director: entity.computedIsDirector,
        computed_is_cast: entity.computedIsCast,
      }
    },
  })
}
