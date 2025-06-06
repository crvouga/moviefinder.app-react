import { ReactNode } from 'react'
import { IMoreScreen } from './@/more-screen-types'
import { MoreIndexScreen } from './more-index-screen'
import { PGLiteReplScreen } from './pglite-repl-screen'
import { WipeLocalDataScreen } from './wipe-local-data-screen'

export const MoreScreen = (props: { screen: IMoreScreen }): ReactNode => {
  switch (props.screen.t) {
    case 'index':
      return <MoreIndexScreen />
    case 'pglite-repl':
      return <PGLiteReplScreen />
    case 'wipe-local-data':
      return <WipeLocalDataScreen />
  }
}
