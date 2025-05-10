import { Paginated } from '~/@/pagination/paginated'
import { Result } from '~/@/result'
import { Media } from '../media'

export type MediaDbQuery = {
  limit: number
  offset: number
}

export type IMediaDb = {
  query: (query: MediaDbQuery) => Promise<Result<{ media: Paginated<Media> }, Error>>
}
