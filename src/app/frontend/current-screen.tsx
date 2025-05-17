import { exhaustive } from '~/@/exhaustive-check'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { FeedScreen } from '../feed/feed-screen'
import { MediaDetailsScreen } from '../media/media/details/media-details-screen'
import { PersonDetailsScreen } from '../media/person/details/person-details-screen'
import { AccountScreen } from '../user/account/account-screen'
import { LoginScreen } from '../user/login/login-screen'

export const CurrentScreen = () => {
  const currentScreen = useCurrentScreen()
  switch (currentScreen.value.t) {
    case 'feed': {
      return <FeedScreen />
    }
    case 'account': {
      return <AccountScreen />
    }
    case 'media-details': {
      return (
        <MediaDetailsScreen
          mediaId={currentScreen.value.mediaId}
          from={currentScreen.value.from ?? { t: 'feed' }}
        />
      )
    }
    case 'login': {
      return <LoginScreen />
    }
    case 'person-details': {
      return (
        <PersonDetailsScreen
          personId={currentScreen.value.personId}
          from={currentScreen.value.from ?? { t: 'feed' }}
        />
      )
    }
    default: {
      return exhaustive(currentScreen.value)
    }
  }
}
