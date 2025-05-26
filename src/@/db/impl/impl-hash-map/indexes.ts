import { EntityField } from '../../interface/query-input/field'

export type Indexes = Map<EntityField, Map<string, Set<EntityField>>>

const populate = (indexes: Indexes, e: Record<string, unknown>, primaryKey: EntityField) => {
  for (const key in e) {
    if (!indexes.has(key)) {
      indexes.set(key, new Map())
    }

    const valueIndexes = indexes.get(key)!

    const value = e[key]

    const valueKey = String(value)

    if (!valueIndexes.has(valueKey)) {
      valueIndexes.set(valueKey, new Set())
    }

    const primaryKeys = valueIndexes.get(valueKey)!

    primaryKeys.add(primaryKey)
  }
}

export const Indexes = {
  populate,
}
