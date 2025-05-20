import { Db } from '~/@/db/impl/impl'
import { isOk } from '~/@/result'
import { IPersonDb } from '../../person/person-db/interface'
import { Credit } from '../credit'
import { ICreditDb } from './interface'

export type Config = {
  t: 'hash-map'
  personDb: IPersonDb
}

export const CreditDb = (config: Config): ICreditDb => {
  return Db({
    t: 'hash-map',
    parser: ICreditDb.parser,
    map: (entity) => Credit.compute(entity),
    entities: new Map(),
    indexes: new Map(),
    toPrimaryKey: (entity) => entity.id,
    getRelated: async (entities) => {
      if (entities.length === 0) return { person: {} }

      const personQueried = await config.personDb.query({
        limit: entities.length,
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
