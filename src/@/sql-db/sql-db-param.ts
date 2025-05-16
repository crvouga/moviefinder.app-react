export type SqlDbParam = string | number | boolean | null | undefined | SqlDbParam[]

const is = (param: unknown): param is SqlDbParam => {
  return (
    typeof param === 'string' ||
    typeof param === 'number' ||
    typeof param === 'boolean' ||
    param === null ||
    param === undefined ||
    Array.isArray(param)
  )
}

const to = (param: unknown): SqlDbParam => {
  if (is(param)) {
    return param
  }
  if (param instanceof Date) {
    return param.toISOString()
  }
  return null
}
export const SqlDbParam = {
  is,
  to,
}
