import { quoteIfPostgresKeyword } from './postgres-keywords'
import { OrderBy } from '../../interface/query-input/order-by'

export const toOrderBySql = <TEntity extends Record<string, unknown>>(
  orderBy: OrderBy<TEntity>,
  fieldToSqlColumn: (field: keyof TEntity) => string | number | symbol | null
): string => {
  const sql = orderBy
    .flatMap((o): string[] => {
      const sqlColumn = fieldToSqlColumn(o.column)
      if (!sqlColumn) return []
      return [`${quoteIfPostgresKeyword(sqlColumn)} ${o.direction.toUpperCase()}`]
    })
    .join(', ')
  return sql ? `ORDER BY ${sql}` : ''
}
