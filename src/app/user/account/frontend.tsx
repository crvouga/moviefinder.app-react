import { ScreenLayout } from '~/app/@/ui/screen-layout'
import { LoginCta } from './frontend/login-cta'

export const AccountScreen = () => {
  return (
    <ScreenLayout topBar={{ title: 'Account' }} includeAppBottomButtons>
      <LoginCta />
    </ScreenLayout>
  )
}
