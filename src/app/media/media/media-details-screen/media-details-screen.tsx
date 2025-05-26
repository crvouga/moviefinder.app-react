import { QueryInput } from '~/@/db/interface/query-input/query-input'
import { QueryOutput } from '~/@/db/interface/query-output/query-output'
import { ImageSet } from '~/@/image-set'
import { preloadImages } from '~/@/ui/img'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useIsMobile } from '~/@/ui/use-is-mobile'
import { useLiveQuery } from '~/@/ui/use-live-query'
import { ScreenFrom } from '~/app/@/screen/current-screen-types'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { AppScreenLayout } from '~/app/@/ui/app-screen-layout'
import { useAppVideoPlayer } from '~/app/@/ui/app-video-player'
import { Ctx, useCtx } from '~/app/frontend/ctx'
import { MediaCreditsSwiper } from '../../credit/media-credit-swiper'
import { RelationshipTypeMediaPosterSwiper } from '../../relationship/relationship-type-media-poster-swiper'
import { MediaVideoSwiper } from '../../video/media-video-swiper'
import { Video } from '../../video/video'
import { Media } from '../media'
import { MediaId } from '../media-id'
import { MainSection } from './main-section'
import { SectionLayout } from './section-layout'

const toQuery = (input: { mediaId: MediaId }): QueryInput<Media> => {
  return QueryInput.init<Media>({
    where: { op: '=', column: 'id', value: input.mediaId },
    limit: 1,
    offset: 0,
  })
}

const toQueryKey = (input: { mediaId: MediaId | null }) => {
  return ['media-query', input.mediaId].join('-')
}

const View = (props: { mediaId: MediaId | null; from: ScreenFrom }) => {
  const ctx = useCtx()
  const currentScreen = useCurrentScreen()
  const isMobile = useIsMobile()

  const swiperProps: Partial<SwiperContainerProps> = {
    slidesOffsetBefore: 24,
    slidesOffsetAfter: 24,
    cssMode: isMobile && false,
  }

  const queried = useLiveQuery({
    queryCache: ctx.queryCache,
    queryKey: toQueryKey({ mediaId: props.mediaId }),
    queryFn: () =>
      props.mediaId ? ctx.mediaDb.liveQuery(toQuery({ mediaId: props.mediaId })) : null,
  })

  const media = QueryOutput.first(queried)
  const from: ScreenFrom = media
    ? {
        t: 'media-details',
        mediaId: media.id,
      }
    : {
        t: 'feed',
      }

  const pushMediaDetails = (input: { mediaId: MediaId }) => {
    currentScreen.push({
      t: 'media-details',
      mediaId: input.mediaId,
      from,
    })
  }

  const videoPlayer = useAppVideoPlayer()

  return (
    <AppScreenLayout
      includeGutter
      topBar={{ onBack: () => currentScreen.push(props.from), title: media?.title ?? ' ' }}
      scrollKey={`media-details-${props.mediaId?.toString() ?? ''}`}
    >
      <MainSection media={media ?? null} />

      <SectionLayout title="Video">
        <MediaVideoSwiper.View
          mediaId={media?.id ?? null}
          swiper={{
            ...swiperProps,
            slideRestorationKey: `media-details-swiper-video-${media?.id}`,
          }}
          onClick={(payload) => {
            videoPlayer.toggle(payload.video)
          }}
        />
      </SectionLayout>

      <SectionLayout title="Cast & Crew">
        <MediaCreditsSwiper.View
          mediaId={media?.id ?? null}
          swiper={{
            ...swiperProps,
            slideRestorationKey: `media-details-swiper-cast-and-crew-${media?.id}`,
          }}
          onClick={({ personId }) => {
            currentScreen.push({ t: 'person-details', personId })
          }}
        />
      </SectionLayout>

      <SectionLayout title="Similar">
        <RelationshipTypeMediaPosterSwiper.View
          swiper={{
            ...swiperProps,
            slideRestorationKey: `media-details-swiper-similar-${media?.id}`,
          }}
          query={{
            mediaId: media?.id ?? null,
            relationshipType: 'similar',
          }}
          onPreload={(input) => MediaDetailsScreen.preload({ ctx, mediaId: input.mediaId })}
          onClick={pushMediaDetails}
        />
      </SectionLayout>
      <SectionLayout title="Recommendations">
        <RelationshipTypeMediaPosterSwiper.View
          swiper={{
            ...swiperProps,
            slideRestorationKey: `media-details-swiper-recommendations-${media?.id}`,
          }}
          query={{
            mediaId: media?.id ?? null,
            relationshipType: 'recommendation',
          }}
          onPreload={(input) => MediaDetailsScreen.preload({ ctx, mediaId: input.mediaId })}
          onClick={pushMediaDetails}
        />
      </SectionLayout>
    </AppScreenLayout>
  )
}

const MAX_IMAGE = 4

const preload = async (input: { ctx: Ctx; mediaId: MediaId }) => {
  const got = await input.ctx.mediaDb.query(MediaDetailsScreen.toQuery({ mediaId: input.mediaId }))

  input.ctx.queryCache.set(MediaDetailsScreen.toQueryKey({ mediaId: input.mediaId }), got)

  const media = QueryOutput.first(got)

  const srcList: (string | undefined)[] = []

  if (media) {
    srcList.push(ImageSet.toMiddleRes(media.backdrop))
  }

  const gotCredits = await input.ctx.creditDb.query(
    MediaCreditsSwiper.toQuery({ mediaId: input.mediaId })
  )

  input.ctx.queryCache.set(MediaCreditsSwiper.toQueryKey({ mediaId: input.mediaId }), gotCredits)

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

  input.ctx.queryCache.set(
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

  input.ctx.queryCache.set(
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

  input.ctx.queryCache.set(MediaVideoSwiper.toQueryKey({ mediaId: input.mediaId }), gotVideos)

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

export const MediaDetailsScreen = {
  View,
  toQuery,
  toQueryKey,
  preload,
}
