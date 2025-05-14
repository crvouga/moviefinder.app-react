import { Button } from '~/@/ui/button'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'

export const LoginScreen = () => {
  const currentScreen = useCurrentScreen()
  return (
    <ScreenLayout
      topBar={{
        title: 'Login',
        onBack: () => {
          currentScreen.push({ t: 'account' })
        },
      }}
    >
      <form>
        <TextField type="tel" label="Phone Number" />
        <TextField type="password" label="Password" />
        <Button type="submit" text="Login" />
      </form>
    </ScreenLayout>
  )
}
