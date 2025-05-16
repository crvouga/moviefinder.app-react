import { PageBasedPagination } from '~/@/pagination/page-based-pagination'
import { Paginated } from '~/@/pagination/paginated'
import { Err, isErr, mapErr, Ok } from '~/@/result'
import { TmdbClient } from '~/@/tmdb-client'
import { TmdbConfiguration } from '~/@/tmdb-client/configuration/configuration'
import { TmdbDiscoverMovieSortBy } from '~/@/tmdb-client/discover/movie'
import { AppErr } from '~/app/@/error'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { MediaDbQueryInput } from '../interface/query-input'
import { MediaDbQueryOutput } from '../interface/query-output'

export const queryDiscoverMovie = async (input: {
  tmdbClient: TmdbClient
  query: MediaDbQueryInput
}): Promise<MediaDbQueryOutput> => {
  const { tmdbClient, query } = input

  const got = await tmdbClient.discover.movie.get({
    pathParams: {},
    queryParams: {
      page: PageBasedPagination.fromPagination(query).page,
      sort_by: toTmdbDiscoverMovieSortBy(query),
    },
  })

  if (isErr(got)) return mapErr(got, AppErr.from)

  if (got.value.status !== 200) return Err(AppErr.from(got.value.body))

  const gotConfig = await tmdbClient.configuration.get({
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
      popularity: result.popularity,
      releaseDate: result.release_date ?? null,
    }
  })

  const media: Paginated<Media> = {
    total: got.value.body.total_results ?? 0,
    limit: query.limit,
    offset: query.offset,
    items,
  }

  return Ok({
    media,
    person: {},
    credit: {},
    relationship: {},
    related: {},
    video: {},
  })
}

const toTmdbDiscoverMovieSortBy = (query: MediaDbQueryInput): TmdbDiscoverMovieSortBy => {
  const { column, direction } = query.orderBy?.[0] ?? { column: 'popularity', direction: 'desc' }
  switch (column) {
    case 'popularity':
      return direction === 'desc' ? 'popularity.desc' : 'popularity.asc'
  }
}
