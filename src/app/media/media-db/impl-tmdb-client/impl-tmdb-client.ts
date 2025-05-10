import { PageBasedPagination } from '~/@/pagination/page-based-pagination'
import { Paginated } from '~/@/pagination/paginated'
import { Err, isErr, mapErr, Ok } from '~/@/result'
import { AppErr } from '~/app/@/error'
import { TmdbClient } from '~/@/tmdb-client'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { IMediaDb } from '../inter'

export type Config = {
  t: 'tmdb-client'
  tmdbClient: TmdbClient
}

export const MediaDb = (config: Config): IMediaDb => {
  return {
    async query(query) {
      const got = await config.tmdbClient.discover.movie.get({
        pathParams: {},
        queryParams: {
          page: PageBasedPagination.fromPagination(query).page,
        },
      })

      if (isErr(got)) return mapErr(got, AppErr.from)

      if (got.value.status !== 200) return Err(AppErr.from(got.value.body))

      const media: Paginated<Media> = {
        total: got.value.body.total_results ?? 0,
        limit: query.limit,
        offset: query.offset,
        items: got.value.body.results.map((result): Media => {
          return {
            id: MediaId.fromTmdbId(result.id),
            title: result.title,
            description: result.overview,
          }
        }),
      }

      return Ok({
        media,
      })
    },
  }
}
