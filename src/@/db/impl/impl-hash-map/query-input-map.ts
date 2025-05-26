import { Pagination } from '~/@/pagination/pagination'
import { EntityField } from '../../interface/query-input/field'
import { QueryInput } from '../../interface/query-input/query-input'
import { filterMap } from './filter-map'
import { sortArray } from './sort-array'

export const queryMap = <TEntity extends Record<string, unknown>>(
  entities: Map<EntityField, TEntity>,
  indexes: Map<EntityField, Map<string, Set<EntityField>>>,
  queryInput: QueryInput<TEntity>
) => {
  const all = entities

  const filtered: Map<EntityField, TEntity> = queryInput.where
    ? filterMap(all, indexes, queryInput.where)
    : all

  const sorted: TEntity[] = queryInput.orderBy
    ? sortArray(Array.from(filtered.values()), queryInput.orderBy)
    : Array.from(filtered.values())

  const paginated = Pagination.paginate(sorted, queryInput)

  return paginated
}
