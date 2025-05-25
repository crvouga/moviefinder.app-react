import { ascend, Comparator, descend } from '~/@/sort'
import { OrderBy } from '../../interface/query-input/order-by'

export const sortArray = <TEntity extends Record<string, unknown>>(
  entities: TEntity[],
  orderBy: OrderBy<TEntity>
): TEntity[] => {
  return entities.sort(
    Comparator.combine(
      orderBy.map((o) => {
        switch (o.direction) {
          case 'asc':
            return ascend((entity) => entity[o.column])
          case 'desc':
            return descend((entity) => entity[o.column])
        }
      })
    )
  )
}
