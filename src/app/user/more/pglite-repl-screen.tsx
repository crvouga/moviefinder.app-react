import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { AppScreenLayout } from '~/app/@/ui/app-screen-layout'
import { PgliteRepl } from '~/app/frontend/pglite-repl'

export const PGLiteReplScreen = () => {
  const currentScreen = useCurrentScreen()
  return (
    <AppScreenLayout
      topBar={{
        title: 'PGLite REPL',
        onBack: () => {
          currentScreen.replace({ t: 'user', c: { t: 'more', c: { t: 'index' } } })
        },
      }}
      scrollKey="pglite-repl"
    >
      <PgliteRepl />
    </AppScreenLayout>
  )
}
