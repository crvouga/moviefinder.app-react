import { ImageSet } from '~/@/image-set'
import { useSubscription } from '~/@/pub-sub'
import { Img } from '~/@/ui/img'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'
import { useCtx } from '~/app/frontend/ctx'
import { CreditsCardSwiper } from '../credit/frontend/credit-swiper'
import { Media } from '../media'
import { MediaId } from '../media-id'
import { RelationshipTypeMediaPosterSwiper } from '../relationship/frontend/relationship-type-media-poster-swiper'

const SLIDES_OFFSET_BEFORE = 24
const SLIDES_OFFSET_AFTER = 24

export const MediaDetailsScreen = (props: { mediaId: MediaId }) => {
  const ctx = useCtx()

  const queried = useSubscription(
    () =>
      ctx.mediaDb.liveQuery({
        where: { op: '=', column: 'id', value: props.mediaId },
        limit: 1,
        offset: 0,
      }),
    [ctx, props.mediaId]
  )

  const currentScreen = useCurrentScreen()
  const media = queried?.t === 'ok' ? queried.value.entities.items[0] : null

  return (
    <ScreenLayout
      includeGutter
      // key={media?.id}
      topBar={{
        onBack: () => currentScreen.push({ t: 'feed' }),
        title: media?.title ?? ' ',
      }}
    >
      <MainSection media={media ?? null} />

      <Section title="Cast & Crew">
        <CreditsCardSwiper
          slidesOffsetBefore={SLIDES_OFFSET_BEFORE}
          slidesOffsetAfter={SLIDES_OFFSET_AFTER}
          mediaId={media?.id ?? null}
        />
      </Section>

      <Section title="Similar">
        <RelationshipTypeMediaPosterSwiper
          slidesOffsetBefore={SLIDES_OFFSET_BEFORE}
          slidesOffsetAfter={SLIDES_OFFSET_AFTER}
          mediaId={media?.id ?? null}
          relationshipType="similar"
        />
      </Section>

      <Section title="Recommendations">
        <RelationshipTypeMediaPosterSwiper
          slidesOffsetBefore={SLIDES_OFFSET_BEFORE}
          slidesOffsetAfter={SLIDES_OFFSET_AFTER}
          mediaId={media?.id ?? null}
          relationshipType="recommendation"
        />
      </Section>
    </ScreenLayout>
  )
}

const MainSection = (props: { media: Media | null }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 pb-12">
      <Img
        className="aspect-video w-full object-cover"
        src={ImageSet.toHighestRes(props.media?.backdrop)}
        alt={props.media?.title ?? ' '}
      />
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-center text-3xl font-bold">{props.media?.title ?? '...'}</p>
        {props.media?.description && <p className="text-center">{props.media.description}</p>}
      </div>
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
