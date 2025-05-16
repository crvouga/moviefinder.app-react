import { Paginated } from '~/@/pagination/paginated'
import { Err, isErr, mapErr, Ok } from '~/@/result'
import { TmdbClient } from '~/@/tmdb-client'
import { Configuration } from '~/@/tmdb-client/configuration/configuration'
import { AppErr } from '~/app/@/error'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { MediaDbQueryOutput } from '../interface/query-output'

export const queryMovieDetails = async (input: {
  tmdbClient: TmdbClient
  tmdbMovieId: number
}): Promise<MediaDbQueryOutput> => {
  const { tmdbClient, tmdbMovieId } = input

  const got = await tmdbClient.movie.details.get({
    pathParams: {
      id: tmdbMovieId,
    },
    queryParams: {
      append_to_response: tmdbClient.movie.details.APPEND_TO_RESPONSE_ALL,
    },
  })

  if (isErr(got)) return mapErr(got, AppErr.from)

  if (got.value.status !== 200) return Err(AppErr.from(got.value.body))

  const gotConfig = await tmdbClient.configuration.get({
    pathParams: {},
    queryParams: {},
  })

  if (isErr(gotConfig)) return mapErr(gotConfig, AppErr.from)

  const items: Media[] = [got.value.body].flatMap((result): Media[] => {
    if (!result) return []
    if (!result.id) return []

    return [
      {
        id: MediaId.fromTmdbId(result.id),
        title: result.title ?? null,
        description: result.overview ?? null,
        poster: Configuration.toPosterImageSet(gotConfig.value.body, result.poster_path ?? null),
        backdrop: Configuration.toBackdropImageSet(
          gotConfig.value.body,
          result.backdrop_path ?? null
        ),
        popularity: result.popularity ?? null,
        releaseDate: result.release_date ?? null,
      },
    ]
  })

  const media: Paginated<Media> = {
    total: 1,
    limit: 1,
    offset: 0,
    items,
  }

  return Ok({
    media,
    person: [],
    credit: [],
    relationship: [],
    related: [],
    video: [],
  })
}
