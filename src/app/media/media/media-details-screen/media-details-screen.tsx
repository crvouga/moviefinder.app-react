import { QueryInput } from '~/@/db/interface/query-input/query-input'
import { QueryOutput } from '~/@/db/interface/query-output/query-output'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useIsMobile } from '~/@/ui/use-is-mobile'
import { useSubscription } from '~/@/ui/use-subscription'
import { ScreenFrom } from '~/app/@/screen/current-screen-types'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { AppScreenLayout } from '~/app/@/ui/app-screen-layout'
import { useAppVideoPlayer } from '~/app/@/ui/app-video-player'
import { useCtx } from '~/app/frontend/ctx'
import { MediaCreditsSwiper } from '../../credit/media-credit-swiper'
import { RelationshipTypeMediaPosterSwiper } from '../../relationship/relationship-type-media-poster-swiper'
import { MediaVideoSwiper } from '../../video/media-video-swiper'
import { Media } from '../media'
import { MediaId } from '../media-id'
import { MainSection } from './main-section'
import { preloadMediaDetailsScreen } from './preload-media-details-screen'
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

  const queried = useSubscription({
    subCache: ctx.subCache,
    subKey: toQueryKey({ mediaId: props.mediaId }),
    subFn: () =>
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
          onPreload={(input) => preloadMediaDetailsScreen({ ctx, mediaId: input.mediaId })}
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
          onPreload={(input) => preloadMediaDetailsScreen({ ctx, mediaId: input.mediaId })}
          onClick={pushMediaDetails}
        />
      </SectionLayout>
    </AppScreenLayout>
  )
}

export const MediaDetailsScreen = {
  View,
  toQuery,
  toQueryKey,
}
