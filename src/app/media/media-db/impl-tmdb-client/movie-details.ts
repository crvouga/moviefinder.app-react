import { Paginated } from '~/@/pagination/paginated'
import { Err, isErr, mapErr, Ok } from '~/@/result'
import { TmdbClient } from '~/@/tmdb-client'
import { TmdbConfiguration } from '~/@/tmdb-client/configuration/configuration'
import { DbErr } from '~/@/db/interface/error'
import { Credit } from '../../credit/credit'
import { CreditId } from '../../credit/credit-id'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { Person } from '../../person/person'
import { PersonId } from '../../person/person-id'
import { Relationship } from '../../relationship/relationship'
import { RelationshipId } from '../../relationship/relationship-id'
import { RelationshipType } from '../../relationship/relationship-type'
import { Video } from '../../video/video'
import { VideoId } from '../../video/video-id'
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

  if (isErr(got)) return mapErr(got, DbErr.from)

  if (got.value.status !== 200) return Err(DbErr.from(got.value.body))

  const gotConfig = await tmdbClient.configuration.get({
    pathParams: {},
    queryParams: {},
  })

  if (isErr(gotConfig)) return mapErr(gotConfig, DbErr.from)

  const items: Media[] = [got.value.body].flatMap((result): Media[] => {
    if (!result) return []
    if (!result.id) return []
    return [
      {
        id: MediaId.fromTmdbId(result.id),
        title: result.title ?? null,
        description: result.overview ?? null,
        poster: TmdbConfiguration.toPosterImageSet(gotConfig.value.body, result.poster_path ?? null),
        backdrop: TmdbConfiguration.toBackdropImageSet(
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

  const mediaId = MediaId.fromTmdbId(tmdbMovieId)

  const person: Record<PersonId, Person> = {}
  const personList = [
    ...(got.value.body.credits?.cast ?? []),
    ...(got.value.body.credits?.crew ?? []),
  ]
  for (const p of personList) {
    if (!p.id) continue
    const personId = PersonId.fromTmdbId(p.id)
    person[personId] = {
      id: personId,
      name: p.name ?? null,
      profile: TmdbConfiguration.toProfileImageSet(gotConfig.value.body, p.profile_path ?? null),
      popularity: p.popularity ?? null,
    }
  }

  const credit: Record<CreditId, Credit> = {}
  for (const cast of got.value.body.credits?.cast ?? []) {
    if (!cast.id) continue
    const creditId = CreditId.fromTmdbId(cast.id)
    credit[creditId] = {
      id: creditId,
      character: cast.character ?? null,
      order: cast.order ?? null,
      job: null,
      mediaId: MediaId.fromTmdbId(cast.id),
      personId: PersonId.fromTmdbId(cast.id),
    }
  }
  for (const crew of got.value.body.credits?.crew ?? []) {
    if (!crew.id) continue
    const creditId = CreditId.fromTmdbId(crew.id)
    credit[creditId] = {
      id: creditId,
      character: null,
      order: null,
      job: crew.job ?? null,
      mediaId: MediaId.fromTmdbId(crew.id),
      personId: PersonId.fromTmdbId(crew.id),
    }
  }


  const related: Record<MediaId, Media> = {}
  const relationship: Record<RelationshipId, Relationship> = {}
  for (const movie of got.value.body.recommendations?.results ?? []) {
    if (!movie.id) continue
    const relationshipType: RelationshipType = 'recommendation'
    const relationshipId = RelationshipId.fromTmdbId({
      tmdbId: movie.id,
      type: relationshipType,
    })
    const relatedMediaId = MediaId.fromTmdbId(movie.id)
    relationship[relationshipId] = {
      id: relationshipId,
      from: mediaId,
      to: relatedMediaId,
      type: relationshipType,
    }
    related[relatedMediaId] = {
      id: relatedMediaId,
      title: movie.title ?? null,
      description: movie.overview ?? null,
      poster: TmdbConfiguration.toPosterImageSet(gotConfig.value.body, movie.poster_path ?? null),
      backdrop: TmdbConfiguration.toBackdropImageSet(gotConfig.value.body, movie.backdrop_path ?? null),
      popularity: movie.popularity ?? null,
      releaseDate: movie.release_date ?? null,
    }
  }
  for (const movie of got.value.body.similar?.results ?? []) {
    if (!movie.id) continue
    const relationshipType: RelationshipType = 'similar'
    const relationshipId = RelationshipId.fromTmdbId({
      tmdbId: movie.id,
      type: relationshipType,
    })
    const relatedMediaId = MediaId.fromTmdbId(movie.id)
    relationship[relationshipId] = {
      id: relationshipId,
      from: mediaId,
      to: relatedMediaId,
      type: relationshipType,
    }
    related[relatedMediaId] = {
      id: relatedMediaId,
      title: movie.title ?? null,
      description: movie.overview ?? null,
      poster: TmdbConfiguration.toPosterImageSet(gotConfig.value.body, movie.poster_path ?? null),
      backdrop: TmdbConfiguration.toBackdropImageSet(gotConfig.value.body, movie.backdrop_path ?? null),
      popularity: movie.popularity ?? null,
      releaseDate: movie.release_date ?? null,
    }
  }

  const video: Record<VideoId, Video> = {}
  for (const v of got.value.body.videos?.results ?? []) {
    if (!v.id) continue
    const videoId = VideoId.fromTmdbId(v.id)
    video[videoId] = {
      id: videoId,
      name: v.name ?? null,
      key: v.key ?? null,
      site: v.site ?? null,
      type: v.type ?? null,
      official: v.official ?? null,
      publishedAt: v.published_at ?? null,
      iso_639_1: v.iso_639_1 ?? null,
      iso_3166_1: v.iso_3166_1 ?? null,
      size: v.size ?? null,
    }
  }

  return Ok({
    media,
    person,
    credit,
    relationship,
    related,
    video,
  })
}


