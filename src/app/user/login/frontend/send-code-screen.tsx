import { useReducer } from 'react'
import { Loading, NotAsked, Ok, RemoteResult } from '~/@/result'
import { Button } from '~/@/ui/button'
import { Form } from '~/@/ui/form'
import { TextField } from '~/@/ui/text-field'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'

type State = {
  phoneNumber: string
  request: RemoteResult<null, Error>
}

export const SendCodeScreen = () => {
  const currentScreen = useCurrentScreen()

  const [state, patch] = useReducer(
    (state: State, action: Partial<State>) => ({ ...state, ...action }),
    {
      phoneNumber: '',
      request: NotAsked,
    }
  )

  const onSubmit = async () => {
    patch({ request: Loading })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    currentScreen.push({ t: 'login', c: { t: 'verify-code', phoneNumber: state.phoneNumber } })
    patch({ request: Ok(null) })
  }

  return (
    <ScreenLayout
      scrollKey="send-code"
      topBar={{
        title: 'Send Code',
        onBack: () => {
          currentScreen.push({ t: 'account' })
        },
      }}
    >
      <Form
        onSubmit={onSubmit}
        submitting={state.request.t === 'loading'}
        renderSubmit={(props) => (
          <Button {...props} className="w-full" variant="contained" type="submit" text="Login" />
        )}
        renderFields={(props) => (
          <TextField
            {...props}
            type="tel"
            label="Phone Number"
            id="phone-number"
            value={state.phoneNumber}
            required
            onChange={(phoneNumber) => patch({ phoneNumber })}
          />
        )}
      />
    </ScreenLayout>
  )
}
