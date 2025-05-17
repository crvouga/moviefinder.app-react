import { createDbFromHashMap } from '~/@/db/impl/create-db-from-hash-map'
import { isOk } from '~/@/result'
import { IPersonDb } from '../../person/person-db/interface'
import { ICreditDb } from './interface'

export type Config = {
  t: 'hash-map'
  personDb: IPersonDb
}

export const CreditDb = (config: Config): ICreditDb => {
  return createDbFromHashMap({
    parser: ICreditDb.parser,
    entities: new Map(),
    indexes: new Map(),
    toPrimaryKey: (entity) => entity.id,
    getRelated: async (entities) => {
      if (entities.length === 0) return { person: {} }

      const personQueried = await config.personDb.query({
        limit: 1000,
        offset: 0,
        where: {
          op: 'in',
          column: 'id',
          value: entities.map((entity) => entity.personId),
        },
      })

      if (!isOk(personQueried)) return { person: {} }

      const personMap = Object.fromEntries(
        personQueried.value.entities.items.map((person) => [person.id, person])
      )

      return {
        person: personMap,
      }
    },
  })
}
