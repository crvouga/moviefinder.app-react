import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'
import { LoginCta } from './login-cta'

export const AccountScreen = () => {
  const currentScreen = useCurrentScreen()
  return (
    <ScreenLayout
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
    </ScreenLayout>
  )
}
