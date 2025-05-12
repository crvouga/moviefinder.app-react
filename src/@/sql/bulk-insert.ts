import { DbConnParam } from '../db-conn/interface'

export const toBulkInsertSql = (input: { params: DbConnParam[][] }) => {
  const variables = input.params
    .map((row, i) => {
      const offset = i * row.length
      const paramsStr = row.map((_param, i) => `$${offset + i + 1}`).join(',')
      return `(${paramsStr})`
    })
    .join(',')

  return {
    params: input.params.flat(),
    variables,
  }
}
