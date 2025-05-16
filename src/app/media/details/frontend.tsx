import { ImageSet } from '~/@/image-set'
import { useSubscription } from '~/@/pub-sub'
import { Img } from '~/@/ui/img'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'
import { useCtx } from '~/app/frontend/ctx'
import { CreditsCardSwiper } from '../credit/frontend/credit-card-swiper'
import { MediaId } from '../media-id'
import { RecommendationMediaPosterSwiper } from '../relationship/frontend/recommendation-media-poster-swiper'

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
      topBar={{
        onBack: () => currentScreen.push({ t: 'feed' }),
        title: media?.title ?? ' ',
      }}
    >
      <div>
        <Img
          className="aspect-video w-full object-cover"
          src={ImageSet.toHighestRes(media?.backdrop)}
          alt={media?.title ?? ' '}
        />
        <div className="flex flex-col items-center justify-center gap-4 p-6">
          <p className="text-center text-3xl font-bold">{media?.title ?? ' '}</p>
          {media?.description && <p className="text-center">{media?.description}</p>}
        </div>
      </div>

      <Section title="Cast & Crew">
        <CreditsCardSwiper mediaId={media?.id ?? ''} />
      </Section>

      <Section title="Recommendations">
        <RecommendationMediaPosterSwiper mediaId={media?.id ?? ''} />
      </Section>
    </ScreenLayout>
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
