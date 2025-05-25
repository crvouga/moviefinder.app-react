import { Pagination } from '~/@/pagination/pagination'
import { EntityField } from '../../interface/query-input/field'
import { Where } from '../../interface/query-input/where'

export const filterMap = <TEntity extends Record<string, unknown>>(
  entities: Map<EntityField, TEntity>,
  indexes: Map<EntityField, Map<string, Set<EntityField>>>,
  where: Where<TEntity>,
  pagination: Pagination
): Map<EntityField, TEntity> => {
  switch (where.op) {
    case 'in': {
      const result = new Map<EntityField, TEntity>()
      const columnIndex = indexes.get(String(where.column))

      if (!columnIndex) return result

      const pksMatchingCriteria = new Set<EntityField>()
      for (const value of where.value) {
        const pksForValue = columnIndex.get(value)
        if (!pksForValue) continue
        for (const pk of pksForValue) {
          pksMatchingCriteria.add(pk)
        }
      }

      for (const pk of pksMatchingCriteria) {
        if (!entities.has(pk)) continue
        const entity = entities.get(pk)!
        result.set(pk, entity)
      }
      return result
    }
    case '=': {
      const result = new Map<EntityField, TEntity>()
      const columnIndex = indexes.get(where.column)

      if (!columnIndex) return result

      const pksMatchingValue = columnIndex.get(where.value)

      if (!pksMatchingValue) return result

      for (const pk of pksMatchingValue) {
        if (!entities.has(pk)) continue
        const entity = entities.get(pk)!
        result.set(pk, entity)
      }
      return result
    }
    case 'and': {
      let accMap = entities
      for (const clause of where.clauses) {
        accMap = filterMap(accMap, indexes, clause, pagination)
      }
      return accMap
    }
  }
}
