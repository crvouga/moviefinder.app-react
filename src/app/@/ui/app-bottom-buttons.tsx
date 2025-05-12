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
      selected: currentScreen.value.type === 'feed',
      onClick: () => currentScreen.push({ type: 'feed' }),
    },
    {
      icon: (props) => <IconUserCircleSolid {...props} />,
      label: 'Account',
      selected: currentScreen.value.type === 'account',
      onClick: () => currentScreen.push({ type: 'account' }),
    },
  ]
}
