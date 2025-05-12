export type SqlOutput = {
  sql: string
  params: unknown[]
}

const isSqlOutput = (value: unknown): value is SqlOutput => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'sql' in value &&
    typeof value.sql === 'string' &&
    'params' in value &&
    Array.isArray(value.params)
  )
}

export const sql = (strings: TemplateStringsArray, ...values: unknown[]) => {
  const params: unknown[] = []
  let rawSql = ''

  for (let i = 0; i < strings.length; i++) {
    rawSql += strings[i]
    if (i < values.length) {
      const value = values[i]
      if (isSqlOutput(value)) {
        // Handle nested SQL queries by inlining their SQL and parameters
        rawSql += value.sql
        params.push(...value.params)
        continue
      }

      if (Array.isArray(value)) {
        // Handle arrays of objects for bulk inserts
        if (value.every((item) => typeof item === 'object' && item !== null)) {
          const placeholders = value.map((item) => {
            const itemValues = Object.values(item)
            params.push(...itemValues)
            return `(${itemValues.map((_, idx) => `$${params.length - itemValues.length + idx + 1}`).join(', ')})`
          })
          rawSql += placeholders.join(', ')
        } else {
          // Handle regular arrays
          const childOutputs = value.map((child) => sql`${child}`)
          rawSql += childOutputs.map((output) => output.rawSql).join(', ')
          params.push(...childOutputs.flatMap((output) => output.params))
        }
        continue
      }

      // Handle regular values
      params.push(value)
      rawSql += `$${params.length}`
    }
  }

  return {
    rawSql,
    params,
  }
}
