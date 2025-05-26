import { QueryOutput } from '~/@/db/interface/query-output/query-output'
import { ImageSet } from '~/@/image-set'
import { preloadImages } from '~/@/ui/img'
import { Ctx } from '~/app/frontend/ctx'
import { MediaCreditsSwiper } from '../../credit/media-credit-swiper'
import { RelationshipTypeMediaPosterSwiper } from '../../relationship/relationship-type-media-poster-swiper'
import { MediaVideoSwiper } from '../../video/media-video-swiper'
import { Video } from '../../video/video'
import { MediaId } from '../media-id'
import { MediaDetailsScreen } from './media-details-screen'

const MAX_IMAGE = 4

export const preloadMediaDetailsScreen = async (input: { ctx: Ctx; mediaId: MediaId }) => {
  const got = await input.ctx.mediaDb.query(MediaDetailsScreen.toQuery({ mediaId: input.mediaId }))

  input.ctx.subCache.set(MediaDetailsScreen.toQueryKey({ mediaId: input.mediaId }), got)

  const media = QueryOutput.first(got)

  const srcList: (string | undefined)[] = []

  if (media) {
    srcList.push(ImageSet.toMiddleRes(media.backdrop))
  }

  const gotCredits = await input.ctx.creditDb.query(
    MediaCreditsSwiper.toQuery({ mediaId: input.mediaId })
  )

  input.ctx.subCache.set(MediaCreditsSwiper.toQueryKey({ mediaId: input.mediaId }), gotCredits)

  const relatedCredits = QueryOutput.related(gotCredits)

  if (relatedCredits) {
    srcList.push(
      ...Object.values(relatedCredits.person)
        .slice(0, MAX_IMAGE)
        .flatMap((person) => ImageSet.toMiddleRes(person.profile))
    )
  }

  const gotSimilar = await input.ctx.relationshipDb.query(
    RelationshipTypeMediaPosterSwiper.toQuery({
      mediaId: input.mediaId,
      relationshipType: 'similar',
    })
  )

  input.ctx.subCache.set(
    RelationshipTypeMediaPosterSwiper.toQueryKey({
      mediaId: input.mediaId,
      relationshipType: 'similar',
    }),
    gotSimilar
  )

  const relatedSimilar = QueryOutput.related(gotSimilar)

  if (relatedSimilar) {
    srcList.push(
      ...Object.values(relatedSimilar.media)
        .slice(0, MAX_IMAGE)
        .flatMap((media) => ImageSet.toMiddleRes(media.poster))
    )
  }

  const gotRecommendations = await input.ctx.relationshipDb.query(
    RelationshipTypeMediaPosterSwiper.toQuery({
      mediaId: input.mediaId,
      relationshipType: 'recommendation',
    })
  )

  input.ctx.subCache.set(
    RelationshipTypeMediaPosterSwiper.toQueryKey({
      mediaId: input.mediaId,
      relationshipType: 'recommendation',
    }),
    gotRecommendations
  )

  const relatedRecommendations = QueryOutput.related(gotRecommendations)

  if (relatedRecommendations) {
    srcList.push(
      ...Object.values(relatedRecommendations.media)
        .slice(0, MAX_IMAGE)
        .flatMap((media) => ImageSet.toMiddleRes(media.poster))
    )
  }

  const gotVideos = await input.ctx.videoDb.query(
    MediaVideoSwiper.toQuery({ mediaId: input.mediaId })
  )

  input.ctx.subCache.set(MediaVideoSwiper.toQueryKey({ mediaId: input.mediaId }), gotVideos)

  const videos = QueryOutput.entities(gotVideos)

  if (videos) {
    srcList.push(
      ...videos.items
        .slice(0, MAX_IMAGE)
        .flatMap((video) => ImageSet.toMiddleRes(Video.toImageSet(video)))
    )
  }

  preloadImages({ srcList })
}
