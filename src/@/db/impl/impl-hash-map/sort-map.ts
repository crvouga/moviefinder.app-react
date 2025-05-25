import { EntityField } from '../../interface/query-input/field'
import { OrderBy } from '../../interface/query-input/order-by'
import { sortArray } from './sort-array'

export const sortMap = <TEntity extends Record<string, unknown>>(
  entities: Map<EntityField, TEntity>,
  _indexes: Map<EntityField, Map<string, Set<EntityField>>>, // indexes are not used for sorting, but kept for signature consistency if needed elsewhere
  orderBy: OrderBy<TEntity>
): TEntity[] => {
  const entitiesArray = Array.from(entities.values())
  return sortArray(entitiesArray, orderBy)
}
