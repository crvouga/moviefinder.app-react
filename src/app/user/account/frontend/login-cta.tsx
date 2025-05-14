import { Button } from '~/@/ui/button'
import { IconDoorOpenSolid } from '~/@/ui/icon/door-open/solid'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'

export const LoginCta = () => {
  const currentScreen = useCurrentScreen()
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <IconDoorOpenSolid className="text-primary size-20" />
      <p className="text-xl font-bold">Login to access your account</p>
      <Button
        variant="contained"
        text="Login"
        onClick={() => currentScreen.push({ t: 'login', c: { t: 'send-code' } })}
      />
    </div>
  )
}
