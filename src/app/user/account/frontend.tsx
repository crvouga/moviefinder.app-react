import { useAppBottomButtons } from '~/app/@/ui/app-bottom-buttons'
import { ScreenLayout } from '~/app/@/ui/screen-layout'

export const AccountScreen = () => {
  const appBottomButtons = useAppBottomButtons()
  return (
    <ScreenLayout topBar={{ title: 'Account' }} actions={appBottomButtons}>
      account
    </ScreenLayout>
  )
}
