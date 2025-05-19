import { BottomButton } from '~/@/ui/bottom-buttons'
import { IconHomeSolid, IconUserCircleSolid } from '~/@/ui/icon'
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
      selected: currentScreen.value.t === 'user',
      onClick: () => currentScreen.push({ t: 'user', c: { t: 'account' } }),
    },
  ]
}
