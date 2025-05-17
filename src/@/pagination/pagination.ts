export type Pagination = {
  limit: number
  offset: number
}

const nextPage = (pagination: Pagination): Pagination => {
  return {
    limit: pagination.limit,
    offset: pagination.offset + pagination.limit,
  }
}

const prevPage = (pagination: Pagination): Pagination => {
  return {
    limit: pagination.limit,
    offset: pagination.offset - pagination.limit,
  }
}

const paginate = <T>(entities: T[], pagination: Pagination): T[] => {
  return entities.slice(pagination.offset, pagination.offset + pagination.limit)
}

export const Pagination = {
  nextPage,
  prevPage,
  paginate,
}
