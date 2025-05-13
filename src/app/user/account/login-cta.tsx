import { Button } from '~/@/ui/button'
import { IconDoorOpenSolid } from '~/@/ui/icon/door-open/solid'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'

export const LoginCta = () => {
  const currentScreen = useCurrentScreen()
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <IconDoorOpenSolid className="text-primary size-24" />
      <p className="text-bold">Login to access your account</p>
      <Button variant="contained" text="Login" onClick={() => currentScreen.push({ t: 'login' })} />
    </div>
  )
}
