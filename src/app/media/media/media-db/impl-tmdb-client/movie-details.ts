import { IDb } from '~/@/db/interface'
import { DbErr } from '~/@/db/interface/error'
import { enumerate } from '~/@/enumerate'
import { Paginated } from '~/@/pagination/paginated'
import { Err, isErr, mapErr, Ok } from '~/@/result'
import { TmdbClient } from '~/@/tmdb-client'
import { TmdbConfiguration } from '~/@/tmdb-client/configuration/configuration'
import { Credit } from '../../../credit/credit'
import { CreditId } from '../../../credit/credit-id'
import { Person } from '../../../person/person'
import { PersonId } from '../../../person/person-id'
import { Relationship } from '../../../relationship/relationship'
import { RelationshipId } from '../../../relationship/relationship-id'
import { RelationshipType } from '../../../relationship/relationship-type'
import { Video } from '../../../video/video'
import { VideoId } from '../../../video/video-id'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { IMediaDb } from '../interface/interface'

export const queryMovieDetails = async (input: {
  tmdbClient: TmdbClient
  tmdbMovieId: number
}): Promise<IDb.InferQueryOutput<typeof IMediaDb.parser>> => {
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
        poster: TmdbConfiguration.toPosterImageSet(
          gotConfig.value.body,
          result.poster_path ?? null
        ),
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

  const crew: Record<CreditId, Credit> = {}
  for (const [order, item] of enumerate(got.value.body.credits?.crew ?? [])) {
    if (!item.credit_id) continue
    const creditId = CreditId.fromTmdbId(item.credit_id)
    if (!item.id) continue
    const credit: Credit = Credit.compute({
      type: 'crew',
      id: creditId,
      character: null,
      order: order ?? null,
      job: item.job ?? null,
      mediaId,
      personId: PersonId.fromTmdbId(item.id),
      computedIsDirector: null,
      computedIsCast: null,
    })
    crew[creditId] = credit
  }

  const cast: Record<CreditId, Credit> = {}
  for (const item of got.value.body.credits?.cast ?? []) {
    if (!item.credit_id) continue
    const creditId = CreditId.fromTmdbId(item.credit_id)
    if (!item.id) continue
    const credit: Credit = Credit.compute({
      type: 'cast',
      id: creditId,
      character: item.character ?? null,
      order: item.order ?? null,
      job: null,
      mediaId,
      personId: PersonId.fromTmdbId(item.id),
      computedIsDirector: null,
      computedIsCast: null,
    })
    cast[creditId] = credit
  }

  const credit: Record<CreditId, Credit> = {
    ...crew,
    ...cast,
  }

  const relatedMedia: Record<MediaId, Media> = {}
  const relationship: Record<RelationshipId, Relationship> = {}
  for (const [i, movie] of enumerate(got.value.body.recommendations?.results ?? [])) {
    if (!movie.id) continue
    const relationshipType: RelationshipType = 'recommendation'
    const toId = MediaId.fromTmdbId(movie.id)
    const relationshipId = RelationshipId.init({
      fromId: mediaId,
      toId: toId,
      type: relationshipType,
    })
    relationship[relationshipId] = {
      id: relationshipId,
      from: mediaId,
      to: toId,
      type: relationshipType,
      order: i * (got.value.body.recommendations?.page ?? 1),
    }
    relatedMedia[toId] = {
      id: toId,
      title: movie.title ?? null,
      description: movie.overview ?? null,
      poster: TmdbConfiguration.toPosterImageSet(gotConfig.value.body, movie.poster_path ?? null),
      backdrop: TmdbConfiguration.toBackdropImageSet(
        gotConfig.value.body,
        movie.backdrop_path ?? null
      ),
      popularity: movie.popularity ?? null,
      releaseDate: movie.release_date ?? null,
    }
  }
  for (const [i, movie] of enumerate(got.value.body.similar?.results ?? [])) {
    if (!movie.id) continue
    const relationshipType: RelationshipType = 'similar'
    const toId = MediaId.fromTmdbId(movie.id)
    const relationshipId = RelationshipId.init({
      fromId: mediaId,
      toId,
      type: relationshipType,
    })
    relationship[relationshipId] = {
      id: relationshipId,
      from: mediaId,
      to: toId,
      type: relationshipType,
      order: i * (got.value.body.similar?.page ?? 1),
    }
    relatedMedia[toId] = {
      id: toId,
      title: movie.title ?? null,
      description: movie.overview ?? null,
      poster: TmdbConfiguration.toPosterImageSet(gotConfig.value.body, movie.poster_path ?? null),
      backdrop: TmdbConfiguration.toBackdropImageSet(
        gotConfig.value.body,
        movie.backdrop_path ?? null
      ),
      popularity: movie.popularity ?? null,
      releaseDate: movie.release_date ?? null,
    }
  }

  const video: Record<VideoId, Video> = {}
  for (const [order, v] of enumerate(got.value.body.videos?.results ?? [])) {
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
      mediaId,
      order: order,
    }
  }

  return Ok({
    entities: media,
    related: {
      person,
      credit,
      relationship,
      media: relatedMedia,
      video,
    },
  })
}
