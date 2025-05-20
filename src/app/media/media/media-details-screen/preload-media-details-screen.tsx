import { useEffect } from 'react'
import { QueryOutput } from '~/@/db/interface/query-output/query-output'
import { ImageSet } from '~/@/image-set'
import { preloadImages } from '~/@/ui/img'
import { Ctx, useCtx } from '~/app/frontend/ctx'
import { MediaCreditsSwiper } from '../../credit/frontend/media-credit-swiper'
import { RelationshipTypeMediaPosterSwiper } from '../../relationship/frontend/relationship-type-media-poster-swiper'
import { MediaId } from '../media-id'
import { MediaDetailsScreen } from './media-details-screen'

export const preloadMediaDetailsScreen = async (input: { ctx: Ctx; mediaId: MediaId }) => {
  const got = await input.ctx.mediaDb.query(MediaDetailsScreen.toQuery({ mediaId: input.mediaId }))

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

  preloadImages({ srcList })
}

export const usePreloadMedia = (input: { mediaId: MediaId }) => {
  const { mediaId } = input
  const ctx = useCtx()
  useEffect(() => {
    preloadMediaDetailsScreen({ ctx, mediaId })
  }, [mediaId])
}

export const PreloadMedia = (props: { mediaId: MediaId }) => {
  usePreloadMedia(props)

  return null
}
