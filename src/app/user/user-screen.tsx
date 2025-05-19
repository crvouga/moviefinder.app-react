import { IUserScreen } from './@/user-screen-types'
import { AccountScreen } from './account/account-screen'
import { MoreScreen } from './more/more-screen'

export const UserScreen = (props: { screen: IUserScreen }) => {
  switch (props.screen.t) {
    case 'account':
      return <AccountScreen />
    case 'more':
      return <MoreScreen screen={props.screen.c} />
    default:
      throw new Error('invalid screen')
  }
}
