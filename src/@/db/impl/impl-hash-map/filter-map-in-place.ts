import { EntityField } from '../../interface/query-input/field'
import { Where } from '../../interface/query-input/where'
import { Indexes } from './indexes'

export const filterMapInPlace = <TEntity extends Record<string, unknown>>(
  entities: Map<EntityField, TEntity>,
  indexes: Indexes,
  where: Where<TEntity>
): void => {
  switch (where.op) {
    case 'in': {
      const columnIndex = indexes.get(String(where.column))

      if (!columnIndex) {
        entities.clear()
        return
      }

      const pksMatchingCriteria = new Set<EntityField>()
      for (const value of where.value) {
        const pksForValue = columnIndex.get(value)
        if (pksForValue) {
          for (const pk of pksForValue) {
            pksMatchingCriteria.add(pk)
          }
        }
      }

      const currentPks = Array.from(entities.keys())
      for (const pk of currentPks) {
        if (!pksMatchingCriteria.has(pk)) {
          entities.delete(pk)
        }
      }
      return
    }
    case '=': {
      const columnIndex = indexes.get(where.column)

      if (!columnIndex) {
        entities.clear()
        return
      }

      const pksMatchingValue = columnIndex.get(where.value)

      if (!pksMatchingValue) {
        entities.clear()
        return
      }

      const currentPks = Array.from(entities.keys())
      for (const pk of currentPks) {
        if (!pksMatchingValue.has(pk)) {
          entities.delete(pk)
        }
      }
      return
    }
    case 'and': {
      for (const clause of where.clauses) {
        filterMapInPlace(entities, indexes, clause)
        if (entities.size === 0) {
          break
        }
      }
      return
    }
  }
}
