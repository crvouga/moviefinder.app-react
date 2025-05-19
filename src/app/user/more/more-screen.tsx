import { IMoreScreen } from './@/more-screen-types'
import { MoreIndexScreen } from './more-index-screen'
import { PGLiteReplScreen } from './pglite-repl-screen'

export const MoreScreen = (props: { screen: IMoreScreen }) => {
  switch (props.screen.t) {
    case 'index':
      return <MoreIndexScreen />
    case 'pglite-repl':
      return <PGLiteReplScreen />
  }
}
