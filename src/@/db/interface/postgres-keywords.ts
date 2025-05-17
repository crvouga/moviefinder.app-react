const POSTGRES_KEYWORDS = ['order', 'type', 'from', 'to']
const isPostgresKeyword = (column: string): boolean => {
  return POSTGRES_KEYWORDS.includes(column)
}
export const quoteIfPostgresKeyword = (column: string): string => {
  return isPostgresKeyword(column) ? `"${column}"` : column
}
