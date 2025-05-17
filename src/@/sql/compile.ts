import { SqlDbParam } from '../sql-db/sql-db-param'

export const compileSql = (sql: string, params: SqlDbParam[] | undefined) => {
  let paramIndex = 0
  return sql.replace(/\?/g, () => {
    const param = params?.[paramIndex++]

    if (!param) return '?'

    if (typeof param === 'string') {
      return `'${param}'`
    }
    return String(param)
  })
}
