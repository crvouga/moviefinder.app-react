import { SwiperContainerProps } from '~/@/ui/swiper'
import { ScreenFrom } from '~/app/@/screen/current-screen-types'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'
import { useCtx } from '~/app/frontend/ctx'
import { MediaCreditsSwiper } from '../../credit/frontend/media-credit-swiper'
import { RelationshipTypeMediaPosterSwiper } from '../../relationship/frontend/relationship-type-media-poster-swiper'
import { MediaId } from '../media-id'
import { MainSection } from './main-section'
import { preloadMediaDetailsScreen } from './preload-media-details-screen'
import { SectionLayout } from './section-layout'
import { useSubscription } from '~/@/ui/use-subscription'
import { QueryOutput } from '~/@/db/interface/query-output/query-output'
import { QueryInput } from '~/@/db/interface/query-input/query-input'
import { Media } from '../media'

const SWIPER_PROPS: Partial<SwiperContainerProps> = {
  slidesOffsetBefore: 24,
  slidesOffsetAfter: 24,
}

const toQuery = (input: { mediaId: MediaId }): QueryInput<Media> => {
  return {
    where: { op: '=', column: 'id', value: input.mediaId },
    limit: 1,
    offset: 0,
  }
}

const View = (props: { mediaId: MediaId | null; from: ScreenFrom }) => {
  const ctx = useCtx()
  const currentScreen = useCurrentScreen()

  const queried = useSubscription(['media-query', props.mediaId], () =>
    props.mediaId ? ctx.mediaDb.liveQuery(toQuery({ mediaId: props.mediaId })) : null
  )

  const media = QueryOutput.first(queried)
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
        <MediaCreditsSwiper.View
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
        <RelationshipTypeMediaPosterSwiper.View
          swiper={{
            ...SWIPER_PROPS,
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
            ...SWIPER_PROPS,
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
    </ScreenLayout>
  )
}

export const MediaDetailsScreen = {
  View,
  toQuery,
}
