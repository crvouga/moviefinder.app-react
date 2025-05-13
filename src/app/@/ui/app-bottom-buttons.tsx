import { BottomButton } from '~/@/ui/bottom-buttons'
import { IconHomeSolid } from '~/@/ui/icon/home/solid'
import { IconUserCircleSolid } from '~/@/ui/icon/user-circle/solid'
import { useCurrentScreen } from '../screen/use-current-screen'

export const useAppBottomButtons = (): BottomButton[] => {
  const currentScreen = useCurrentScreen()
  return [
    {
      icon: (props) => <IconHomeSolid {...props} />,
      label: 'Feed',
      selected: currentScreen.value.t === 'feed',
      onClick: () => currentScreen.push({ t: 'feed' }),
    },
    {
      icon: (props) => <IconUserCircleSolid {...props} />,
      label: 'Account',
      selected: currentScreen.value.t === 'account',
      onClick: () => currentScreen.push({ t: 'account' }),
    },
  ]
}
