import { Ok } from '~/@/result'
import { TmdbClient } from '~/@/tmdb-client'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { IMediaDb } from '../interface/interface'
import { queryDiscoverMovie } from './discover-movie'
import { queryMovieDetails } from './movie-details'
import { PubSub } from '~/@/pub-sub'

export type Config = {
  t: 'tmdb-client'
  tmdbClient: TmdbClient
}

export const MediaDb = (config: Config): IMediaDb => {
  const upserted = new Map<MediaId, Media>()

  return {
    async upsert(input) {
      for (const media of input.entities) {
        upserted.set(media.id, media)
      }

      return Ok({
        entities: input.entities,
      })
    },
    liveQuery(_query) {
      return PubSub()
    },
    async query(query) {
      if (query.where?.op === '=') {
        const result = await queryMovieDetails({
          tmdbClient: config.tmdbClient,
          tmdbMovieId: MediaId.toTmdbId(query.where.value),
        })
        return result
      }
      const result = await queryDiscoverMovie({ tmdbClient: config.tmdbClient, query })
      return result
    },
  }
}
