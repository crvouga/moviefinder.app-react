import { TmdbClientConfig } from '../@/tmdb-client-config'
import { MovieCreditsClient } from './credits'
import { MovieDetailsClient } from './details'
import { MovieExternalIdsClient } from './external-ids'
import { MovieImagesClient } from './images'
import { MovieRecommendationsClient } from './recommendations'
import { MovieReviewsClient } from './reviews'
import { MovieSimilarClient } from './similar'
import { MovieVideosClient } from './videos'
import { MovieWatchProvidersClient } from './watch-providers'

export const MovieClient = (config: TmdbClientConfig) => {
  return {
    videos: MovieVideosClient(config),
    details: MovieDetailsClient(config),
    credits: MovieCreditsClient(config),
    externalIds: MovieExternalIdsClient(config),
    recommendations: MovieRecommendationsClient(config),
    similar: MovieSimilarClient(config),
    watchProviders: MovieWatchProvidersClient(config),
    reviews: MovieReviewsClient(config),
    images: MovieImagesClient(config),
  }
}
