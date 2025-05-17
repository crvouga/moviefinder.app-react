import { exhaustive } from '~/@/exhaustive-check'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { FeedScreen } from '../feed/frontend'
import { MediaDetailsScreen } from '../media/details/frontend'
import { PersonDetailsScreen } from '../media/person/details/frontend'
import { AccountScreen } from '../user/account/frontend'
import { LoginScreen } from '../user/login/frontend'

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
