import { QueryInput } from '../../interface/query-input/query-input'
import { toOrderBySql } from './order-by-sql'
import { toWhereSql } from './where-sql'

export const toSql = <TEntity extends Record<string, unknown>>(
  queryInput: QueryInput<TEntity>,
  columnToSqlColumn: (column: keyof TEntity) => string
): string => {
  return [
    queryInput.where ? toWhereSql(queryInput.where, columnToSqlColumn) : '',
    queryInput.orderBy ? toOrderBySql(queryInput.orderBy, columnToSqlColumn) : '',
    queryInput.limit ? `LIMIT ${queryInput.limit}` : '',
    queryInput.offset ? `OFFSET ${queryInput.offset}` : '',
  ]
    .filter(Boolean)
    .join(' ')
}
