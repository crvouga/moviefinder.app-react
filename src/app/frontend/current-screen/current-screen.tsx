import { useEffect } from 'react'
import { cn } from '~/@/ui/cn'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ICurrentScreen } from '../../@/screen/current-screen-types'
import { FeedScreen } from '../../feed/feed-screen'
import { MediaDetailsScreen } from '../../media/media/media-details-screen/media-details-screen'
import { PersonDetailsScreen } from '../../media/person/person-details-screen/person-details-screen'
import { LoginScreen } from '../../user/login/login-screen'
import { UserScreen } from '../../user/user-screen'

export const CurrentScreen = () => {
  const currentScreen = useCurrentScreen()

  useEffect(() => {
    // @ts-ignore
    window.currentScreen = currentScreen.value
  }, [currentScreen.value])

  return (
    <>
      <ConditionalHide name="feed" show={currentScreen.value.t === 'feed'}>
        <FeedScreen />
      </ConditionalHide>

      <CurrentScreenSwitch screen={currentScreen.value} />
    </>
  )
}

const CurrentScreenSwitch = (props: { screen: ICurrentScreen }) => {
  switch (props.screen.t) {
    case 'feed':
      return null
    case 'user':
      return <UserScreen screen={props.screen.c} />
    case 'login':
      return <LoginScreen screen={props.screen.c} />
    case 'media-details':
      return (
        <MediaDetailsScreen
          mediaId={props.screen.mediaId}
          from={props.screen.from ?? { t: 'feed' }}
        />
      )
    case 'person-details':
      return (
        <PersonDetailsScreen
          personId={props.screen.personId}
          from={props.screen.from ?? { t: 'feed' }}
        />
      )
  }
}

const ConditionalHide = (props: { children: React.ReactNode; name: string; show: boolean }) => {
  return (
    <div
      data-screen={props.name}
      className={cn(!props.show && 'hidden', 'flex h-full w-full flex-col overflow-hidden')}
    >
      {props.children}
    </div>
  )
}
