import { cn } from '~/@/ui/cn'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ICurrentScreen } from '../@/screen/current-screen'
import { FeedScreen } from '../feed/feed-screen'
import { MediaDetailsScreen } from '../media/media/media-details-screen/media-details-screen'
import { PersonDetailsScreen } from '../media/person/person-details-screen/person-details-screen'
import { AccountScreen } from '../user/account/account-screen'
import { LoginScreen } from '../user/login/login-screen'

export const CurrentScreen = () => {
  const currentScreen = useCurrentScreen()
  return (
    <>
      <ConditionalHide t="feed">
        <FeedScreen />
      </ConditionalHide>
      <ConditionalHide t="account">
        <AccountScreen />
      </ConditionalHide>
      <ConditionalHide t="media-details">
        <MediaDetailsScreen
          mediaId={currentScreen.value.t === 'media-details' ? currentScreen.value.mediaId : null}
          from={
            currentScreen.value.t === 'media-details'
              ? (currentScreen.value.from ?? { t: 'feed' })
              : { t: 'feed' }
          }
        />
      </ConditionalHide>
      <ConditionalHide t="login">
        <LoginScreen />
      </ConditionalHide>
      <ConditionalHide t="person-details">
        <PersonDetailsScreen
          personId={
            currentScreen.value.t === 'person-details' ? currentScreen.value.personId : null
          }
          from={
            currentScreen.value.t === 'person-details'
              ? (currentScreen.value.from ?? { t: 'feed' })
              : { t: 'feed' }
          }
        />
      </ConditionalHide>
    </>
  )
}
const ConditionalHide = (props: { children: React.ReactNode; t: ICurrentScreen['t'] }) => {
  const currentScreen = useCurrentScreen()
  return (
    <div
      data-screen={props.t}
      className={cn(
        currentScreen.value.t !== props.t && 'hidden',
        'flex h-full w-full flex-col overflow-hidden'
      )}
    >
      {props.children}
    </div>
  )
}
