export type Paginated<T> = {
  items: T[]
  total: number
  offset: number
  limit: number
}
