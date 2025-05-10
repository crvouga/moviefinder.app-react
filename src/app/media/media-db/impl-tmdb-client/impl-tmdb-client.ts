import { Err, isErr, Ok } from '~/@/result'
import { TmdbClient } from '~/app/@/tmdb-client'
import { IMediaDb } from '../inter'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { Paginated } from '~/@/pagination/paginated'

export type Config = {
  t: 'tmdb-client'
  tmdbClient: TmdbClient
}

export const MediaDb = (config: Config): IMediaDb => {
  return {
    async query(query) {
      const got = await config.tmdbClient.discover.movie.get({
        pathParams: {},
        queryParams: {},
      })

      if (isErr(got)) return got
      if (got.value.status !== 200) return Err(new Error('Failed to fetch movies'))

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
