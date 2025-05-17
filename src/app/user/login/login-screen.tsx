import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { SendCodeScreen } from './frontend/send-code-screen'
import { VerifyCodeScreen } from './frontend/verify-code-screen'

export const LoginScreen = () => {
  const currentScreen = useCurrentScreen()
  if (currentScreen.value.t !== 'login') return null

  switch (currentScreen.value.c.t) {
    case 'send-code':
      return <SendCodeScreen />
    case 'verify-code':
      return <VerifyCodeScreen phoneNumber={currentScreen.value.c.phoneNumber} />
    default:
      throw new Error('invalid screen')
  }
}
