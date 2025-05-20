import { SwiperContainerProps } from '~/@/ui/swiper'
import { ScreenFrom } from '~/app/@/screen/current-screen-types'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'
import { useCtx } from '~/app/frontend/ctx'
import { MediaCreditsSwiper } from '../../credit/frontend/media-credit-swiper'
import { RelationshipTypeMediaPosterSwiper } from '../../relationship/frontend/relationship-type-media-poster-swiper'
import { preloadMedia } from '../frontend/media-preload'
import { MediaId } from '../media-id'
import { MainSection } from './main-section'
import { SectionLayout } from './section-layout'
import { useMediaDetailsQuery } from './use-media-details-query'

const SWIPER_PROPS: Partial<SwiperContainerProps> = {
  slidesOffsetBefore: 24,
  slidesOffsetAfter: 24,
}

export const MediaDetailsScreen = (props: { mediaId: MediaId | null; from: ScreenFrom }) => {
  const currentScreen = useCurrentScreen()
  const { media } = useMediaDetailsQuery({ mediaId: props.mediaId })
  const ctx = useCtx()
  const from: ScreenFrom = media ? { t: 'media-details', mediaId: media.id } : { t: 'feed' }

  const pushMediaDetails = (input: { mediaId: MediaId }) => {
    currentScreen.push({ t: 'media-details', mediaId: input.mediaId, from })
  }

  return (
    <ScreenLayout
      includeGutter
      topBar={{ onBack: () => currentScreen.push(props.from), title: media?.title ?? ' ' }}
      scrollKey={`media-details-${props.mediaId?.toString() ?? ''}`}
    >
      <MainSection media={media ?? null} />

      <SectionLayout title="Cast & Crew">
        <MediaCreditsSwiper
          mediaId={media?.id ?? null}
          swiper={{
            ...SWIPER_PROPS,
            slideRestorationKey: `media-details-swiper-cast-and-crew-${media?.id}`,
          }}
          onClick={({ personId }) => {
            currentScreen.push({ t: 'person-details', personId })
          }}
        />
      </SectionLayout>

      <SectionLayout title="Similar">
        <RelationshipTypeMediaPosterSwiper
          swiper={{
            ...SWIPER_PROPS,
            slideRestorationKey: `media-details-swiper-similar-${media?.id}`,
          }}
          query={{
            mediaId: media?.id ?? null,
            relationshipType: 'similar',
          }}
          onPreload={(input) => preloadMedia({ ctx, mediaId: input.mediaId })}
          onClick={pushMediaDetails}
        />
      </SectionLayout>

      <SectionLayout title="Recommendations">
        <RelationshipTypeMediaPosterSwiper
          swiper={{
            ...SWIPER_PROPS,
            slideRestorationKey: `media-details-swiper-recommendations-${media?.id}`,
          }}
          query={{
            mediaId: media?.id ?? null,
            relationshipType: 'recommendation',
          }}
          onPreload={(input) => preloadMedia({ ctx, mediaId: input.mediaId })}
          onClick={pushMediaDetails}
        />
      </SectionLayout>
    </ScreenLayout>
  )
}
