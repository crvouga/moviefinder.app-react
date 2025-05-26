import { IconCommandLineSolid } from '~/@/ui/icon'
import { List } from '~/@/ui/list'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { AppScreenLayout } from '~/app/@/ui/app-screen-layout'

export const MoreIndexScreen = () => {
  const currentScreen = useCurrentScreen()
  return (
    <AppScreenLayout
      scrollKey="user-more"
      topBar={{
        title: 'More',
        onBack: () => {
          currentScreen.push({ t: 'user', c: { t: 'account' } })
        },
      }}
      includeAppBottomButtons
    >
      <List
        items={[
          {
            renderStartIcon: (props) => <IconCommandLineSolid {...props} />,
            text: 'PGLite REPL',
            onClick: () => {
              currentScreen.push({ t: 'user', c: { t: 'more', c: { t: 'pglite-repl' } } })
            },
            link: true,
          },
        ]}
      />
    </AppScreenLayout>
  )
}
