import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { AppScreenLayout } from '~/app/@/ui/app-screen-layout'
import { LoginCta } from './login-cta'

export const AccountScreen = () => {
  const currentScreen = useCurrentScreen()
  return (
    <AppScreenLayout
      scrollKey="account"
      topBar={{
        title: 'Account',
        onMore: () => {
          currentScreen.push({ t: 'user', c: { t: 'more', c: { t: 'index' } } })
        },
      }}
      includeAppBottomButtons
    >
      <LoginCta />
    </AppScreenLayout>
  )
}
