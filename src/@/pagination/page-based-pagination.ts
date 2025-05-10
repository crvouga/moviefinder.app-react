import { Pagination } from './pagination'

export type PagePagePagination = {
  page: number
  pageSize: number
}

export const fromPagination = (pagination: Pagination): PagePagePagination => {
  return {
    page: Math.floor(pagination.offset / pagination.limit) + 1,
    pageSize: pagination.limit,
  }
}

export const toPagination = (pageBasedPagination: PagePagePagination): Pagination => {
  return {
    offset: (pageBasedPagination.page - 1) * pageBasedPagination.pageSize,
    limit: pageBasedPagination.pageSize,
  }
}

export const PageBasedPagination = {
  fromPagination,
  toPagination,
}
