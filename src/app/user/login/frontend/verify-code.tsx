import { useReducer } from 'react'
import { Loading, NotAsked, Ok, RemoteResult } from '~/@/result'
import { Button } from '~/@/ui/button'
import { Form } from '~/@/ui/form'
import { TextField } from '~/@/ui/text-field'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'

type State = {
  code: string
  request: RemoteResult<null, Error>
}

export const VerifyCodeScreen = ({ phoneNumber }: { phoneNumber: string }) => {
  const currentScreen = useCurrentScreen()

  const [state, patch] = useReducer(
    (state: State, action: Partial<State>) => ({ ...state, ...action }),
    {
      code: '',
      request: NotAsked,
    }
  )

  const onSubmit = async () => {
    patch({ request: Loading })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    patch({ request: Ok(null) })
    currentScreen.push({ t: 'account' })
  }

  return (
    <ScreenLayout
      topBar={{
        title: 'Verify Code',
        onBack: () => {
          currentScreen.push({ t: 'login', c: { t: 'send-code' } })
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
          <>
            <p className="text-lg">
              Enter the code we sent to <span className="font-bold">{phoneNumber}</span>
            </p>

            <TextField
              {...props}
              type="tel"
              label="Code"
              id="code"
              value={state.code}
              onChange={(code) => patch({ code })}
            />
          </>
        )}
      />
    </ScreenLayout>
  )
}
