import { Where } from '../../interface/query-input/where'

export const filterArray = <TEntity extends Record<string, unknown>>(
  entities: TEntity[],
  where: Where<TEntity>
): TEntity[] => {
  switch (where.op) {
    case 'in': {
      return entities.filter((entity) => where.value.includes(String(entity[where.column])))
    }
    case '=': {
      return entities.filter((entity) => String(entity[where.column]) === where.value)
    }
    case 'and': {
      return where.clauses.reduce((acc, clause) => filterArray(acc, clause), entities)
    }
  }
}
