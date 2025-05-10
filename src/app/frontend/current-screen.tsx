import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { FeedScreen } from '../feed/frontend'
import { AccountScreen } from '../user/account/frontend'

export const CurrentScreen = () => {
  const currentScreen = useCurrentScreen()
  switch (currentScreen.value.type) {
    case 'feed': {
      return <FeedScreen />
    }
    case 'account': {
      return <AccountScreen />
    }
  }
}
