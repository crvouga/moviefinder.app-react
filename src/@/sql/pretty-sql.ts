import { SqlDbParam } from '../sql-db/sql-db-param'
import { compileSql } from './compile'

export const SQL_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'INSERT',
  'UPDATE',
  'DELETE',
  'CREATE',
  'DROP',
  'TABLE',
  'DATABASE',
  'INDEX',
  'VIEW',
  'TRIGGER',
  'JOIN',
  'LEFT',
  'RIGHT',
  'INNER',
  'OUTER',
  'GROUP',
  'BY',
  'ORDER',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'DISTINCT',
  'UNION',
  'ALL',
  'AS',
  'ON',
  'SET',
  'VALUES',
  'INTO',
  'DEFAULT',
  'NULL',
  'NOT',
  'IN',
  'EXISTS',
  'BETWEEN',
  'LIKE',
  'IS',
  'ASC',
  'DESC',
]

export const toPrettySql = (sql: string, params: SqlDbParam[] | undefined) => {
  const compiledSql = compileSql(sql, params)

  return compiledSql
}
