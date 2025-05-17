import { ImageSet } from '~/@/image-set'
import { CollapsibleArea } from '~/@/ui/collapsible-area'
import { Img } from '~/@/ui/img'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useSubscription } from '~/@/ui/use-subscription'
import { ScreenFrom } from '~/app/@/screen/screen'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'
import { useCtx } from '~/app/frontend/ctx'
import { MediaCreditsSwiper } from '../../credit/frontend/media-credit-swiper'
import { RelationshipTypeMediaPosterSwiper } from '../../relationship/frontend/relationship-type-media-poster-swiper'
import { Media } from '../media'
import { MediaId } from '../media-id'

const SWIPER_PROPS: Partial<SwiperContainerProps> = {
  slidesOffsetBefore: 24,
  slidesOffsetAfter: 24,
}

export const MediaDetailsScreen = (props: { mediaId: MediaId; from: ScreenFrom }) => {
  const currentScreen = useCurrentScreen()
  const ctx = useCtx()

  const queried = useSubscription(['media-query', props.mediaId], () =>
    ctx.mediaDb.liveQuery({
      where: { op: '=', column: 'id', value: props.mediaId },
      limit: 1,
      offset: 0,
    })
  )

  const media = queried?.t === 'ok' ? queried.value.entities.items[0] : null

  const from: ScreenFrom = media ? { t: 'media-details', mediaId: media.id } : { t: 'feed' }

  const preloadMedia = (input: { mediaId: MediaId }) => {
    ctx.mediaDb.query({
      where: { op: '=', column: 'id', value: input.mediaId },
      limit: 1,
      offset: 0,
    })
  }

  const pushMediaDetails = (input: { mediaId: MediaId }) => {
    currentScreen.push({ t: 'media-details', mediaId: input.mediaId, from })
  }

  return (
    <ScreenLayout
      includeGutter
      topBar={{ onBack: () => currentScreen.push(props.from), title: media?.title ?? ' ' }}
      scrollKey={props.mediaId.toString()}
    >
      <MainSection media={media ?? null} />

      <Section title="Cast & Crew">
        <MediaCreditsSwiper
          mediaId={media?.id ?? null}
          swiper={SWIPER_PROPS}
          onClick={({ personId }) => {
            currentScreen.push({ t: 'person-details', personId })
          }}
        />
      </Section>

      <Section title="Similar">
        <RelationshipTypeMediaPosterSwiper
          swiper={SWIPER_PROPS}
          query={{
            mediaId: media?.id ?? null,
            relationshipType: 'similar',
          }}
          onPreload={preloadMedia}
          onClick={pushMediaDetails}
        />
      </Section>

      <Section title="Recommendations">
        <RelationshipTypeMediaPosterSwiper
          swiper={SWIPER_PROPS}
          query={{
            mediaId: media?.id ?? null,
            relationshipType: 'recommendation',
          }}
          onPreload={preloadMedia}
          onClick={pushMediaDetails}
        />
      </Section>
    </ScreenLayout>
  )
}

const MainSection = (props: { media: Media | null }) => {
  return (
    <div className="flex w-full flex-col items-center justify-start">
      <Img
        className="aspect-video w-full object-cover"
        src={ImageSet.toMiddleRes(props.media?.backdrop)}
        alt={props.media?.title ?? ' '}
      />
      <CollapsibleArea collapsiedHeight={200} className="flex flex-col items-center gap-3 p-6">
        {props.media ? (
          <>
            <p className="text-center text-3xl font-bold">{props.media.title}</p>
            <p className="max-w-lg text-center text-base">{props.media.description}</p>
          </>
        ) : (
          <>
            <div className="h-10 w-3/4 animate-pulse rounded bg-neutral-700" />
            <div className="h-26 w-full animate-pulse rounded bg-neutral-700" />
          </>
        )}
      </CollapsibleArea>
    </div>
  )
}

const Section = (props: { title: string; children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 pb-12">
      <p className="w-full px-6 text-left text-3xl font-bold">{props.title}</p>
      {props.children}
    </div>
  )
}
