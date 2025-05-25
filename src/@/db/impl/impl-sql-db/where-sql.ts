import { quoteIfPostgresKeyword } from './postgres-keywords'
import { Where } from '../../interface/query-input/where'

export const toWhereSql = <TEntity extends Record<string, unknown>>(
  where: Where<TEntity>,
  columnToSqlColumn: (column: keyof TEntity) => string | number | symbol | null
): string => {
  switch (where.op) {
    case 'in': {
      if (where.value.length === 0) return ''
      const sqlColumn = columnToSqlColumn(where.column)
      if (!sqlColumn) return ''
      return `WHERE ${quoteIfPostgresKeyword(sqlColumn)} IN (${where.value.map((v) => `'${v}'`).join(',')})`
    }
    case '=': {
      const sqlColumn = columnToSqlColumn(where.column)
      if (!sqlColumn) return ''
      return `WHERE ${quoteIfPostgresKeyword(sqlColumn)} = '${where.value}'`
    }
    case 'and': {
      if (where.clauses.length === 0) return ''
      return `WHERE ${where.clauses.map((clause) => toWhereSql(clause, columnToSqlColumn).replace('WHERE ', '')).join(' AND ')}`
    }
  }
}
