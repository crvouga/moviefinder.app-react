import { ILoginScreen } from './@/login-screen-types'
import { SendCodeScreen } from './frontend/send-code-screen'
import { VerifyCodeScreen } from './frontend/verify-code-screen'

export const LoginScreen = (props: { screen: ILoginScreen }) => {
  switch (props.screen.t) {
    case 'send-code':
      return <SendCodeScreen />
    case 'verify-code':
      return <VerifyCodeScreen phoneNumber={props.screen.phoneNumber} />
    default:
      throw new Error('invalid screen')
  }
}
