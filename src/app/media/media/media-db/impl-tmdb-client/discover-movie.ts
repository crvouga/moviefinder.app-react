import { IDb } from '~/@/db/interface'
import { DbErr } from '~/@/db/interface/error'
import { PageBasedPagination } from '~/@/pagination/page-based-pagination'
import { Paginated } from '~/@/pagination/paginated'
import { Err, isErr, mapErr, Ok } from '~/@/result'
import { TmdbClient } from '~/@/tmdb-client'
import { TmdbConfiguration } from '~/@/tmdb-client/configuration/configuration'
import { TmdbDiscoverMovieSortBy } from '~/@/tmdb-client/discover/movie'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { IMediaDb } from '../interface/interface'

export const queryDiscoverMovie = async (input: {
  tmdbClient: TmdbClient
  query: IDb.InferQueryInput<typeof IMediaDb.parser>
}): Promise<IDb.InferQueryOutput<typeof IMediaDb.parser>> => {
  const { tmdbClient, query } = input

  const got = await tmdbClient.discover.movie.get({
    pathParams: {},
    queryParams: {
      page: PageBasedPagination.fromPagination(query).page,
      sort_by: toTmdbDiscoverMovieSortBy(query),
    },
  })

  if (isErr(got)) return mapErr(got, DbErr.from)

  if (got.value.status !== 200) return Err(DbErr.from(got.value.body))

  const gotConfig = await tmdbClient.configuration.get({
    pathParams: {},
    queryParams: {},
  })

  if (isErr(gotConfig)) return mapErr(gotConfig, DbErr.from)

  const items: Media[] = got.value.body.results.map((result): Media => {
    return {
      id: MediaId.fromTmdbId(result.id),
      title: result.title,
      description: result.overview,
      poster: TmdbConfiguration.toPosterImageSet(gotConfig.value.body, result.poster_path),
      backdrop: TmdbConfiguration.toBackdropImageSet(gotConfig.value.body, result.backdrop_path),
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
    entities: media,
    related: {
      person: {},
      credit: {},
      relationship: {},
      media: {},
      video: {},
    },
  })
}

const toTmdbDiscoverMovieSortBy = (
  query: IDb.InferQueryInput<typeof IMediaDb.parser>
): TmdbDiscoverMovieSortBy => {
  const { column, direction } = query.orderBy?.[0] ?? { column: 'popularity', direction: 'desc' }
  switch (column) {
    case 'popularity':
      return direction === 'desc' ? 'popularity.desc' : 'popularity.asc'
  }
}
