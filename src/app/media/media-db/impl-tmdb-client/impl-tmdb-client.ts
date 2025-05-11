import { PageBasedPagination } from '~/@/pagination/page-based-pagination'
import { Paginated } from '~/@/pagination/paginated'
import { Err, isErr, mapErr, Ok } from '~/@/result'
import { TmdbClient } from '~/@/tmdb-client'
import { Configuration } from '~/@/tmdb-client/configuration/configuration'
import { AppErr } from '~/app/@/error'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { IMediaDb } from '../interface/interface'
import { distinct } from '~/@/distinct'

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

      const gotConfig = await config.tmdbClient.configuration.get({
        pathParams: {},
        queryParams: {},
      })

      if (isErr(gotConfig)) return mapErr(gotConfig, AppErr.from)

      const items: Media[] = got.value.body.results.map((result): Media => {
        return {
          id: MediaId.fromTmdbId(result.id),
          title: result.title,
          description: result.overview,
          poster: Configuration.toPosterImageSet(gotConfig.value.body, result.poster_path),
          backdrop: Configuration.toBackdropImageSet(gotConfig.value.body, result.backdrop_path),
        }
      })

      const media: Paginated<Media> = {
        total: got.value.body.total_results ?? 0,
        limit: query.limit,
        offset: query.offset,
        items: distinct(items, (item) => item.id),
      }

      return Ok({
        media,
      })
    },
  }
}
