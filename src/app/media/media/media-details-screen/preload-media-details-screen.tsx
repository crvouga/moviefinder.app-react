import { QueryOutput } from '~/@/db/interface/query-output/query-output'
import { ImageSet } from '~/@/image-set'
import { preloadImages } from '~/@/ui/img'
import { Ctx } from '~/app/frontend/ctx'
import { MediaCreditsSwiper } from '../../credit/media-credit-swiper'
import { RelationshipTypeMediaPosterSwiper } from '../../relationship/relationship-type-media-poster-swiper'
import { MediaVideoSwiper } from '../../video/media-video-swiper'
import { MediaId } from '../media-id'
import { MediaDetailsScreen } from './media-details-screen'
import { Video } from '../../video/video'

export const preloadMediaDetailsScreen = async (input: { ctx: Ctx; mediaId: MediaId }) => {
  const got = await input.ctx.mediaDb.query(MediaDetailsScreen.toQuery({ mediaId: input.mediaId }))

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const media = QueryOutput.first(got)

  const srcList: (string | undefined)[] = []

  if (media) {
    srcList.push(ImageSet.toMiddleRes(media.backdrop))
  }

  const gotCredits = await input.ctx.creditDb.query(
    MediaCreditsSwiper.toQuery({ mediaId: input.mediaId })
  )

  const relatedCredits = QueryOutput.related(gotCredits)

  if (relatedCredits) {
    srcList.push(
      ...Object.values(relatedCredits.person).flatMap((person) =>
        ImageSet.toMiddleRes(person.profile)
      )
    )
  }

  const gotSimilar = await input.ctx.relationshipDb.query(
    RelationshipTypeMediaPosterSwiper.toQuery({
      mediaId: input.mediaId,
      relationshipType: 'similar',
    })
  )

  const relatedSimilar = QueryOutput.related(gotSimilar)

  if (relatedSimilar) {
    srcList.push(
      ...Object.values(relatedSimilar.media).flatMap((media) => ImageSet.toMiddleRes(media.poster))
    )
  }

  const gotRecommendations = await input.ctx.relationshipDb.query(
    RelationshipTypeMediaPosterSwiper.toQuery({
      mediaId: input.mediaId,
      relationshipType: 'recommendation',
    })
  )

  const relatedRecommendations = QueryOutput.related(gotRecommendations)

  if (relatedRecommendations) {
    srcList.push(
      ...Object.values(relatedRecommendations.media).flatMap((media) =>
        ImageSet.toMiddleRes(media.poster)
      )
    )
  }

  const gotVideos = await input.ctx.videoDb.query(
    MediaVideoSwiper.toQuery({ mediaId: input.mediaId })
  )

  const videos = QueryOutput.entities(gotVideos)

  if (videos) {
    srcList.push(...videos.items.flatMap((video) => ImageSet.toMiddleRes(Video.toImageSet(video))))
  }

  preloadImages({ srcList })
}
