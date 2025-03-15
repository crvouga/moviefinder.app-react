import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { HomeScreen } from '../home/frontend'
import { AccountScreen } from '../user/account/frontend'

export const CurrentScreen = () => {
  const currentScreen = useCurrentScreen()
  switch (currentScreen.value.type) {
    case 'home': {
      return <HomeScreen />
    }
    case 'account': {
      return <AccountScreen />
    }
  }
}
