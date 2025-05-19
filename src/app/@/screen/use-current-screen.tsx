import { usePath } from '~/@/use-path'
import { ICurrentScreen } from './current-screen-types'

export const useCurrentScreen = () => {
  const queryParam = usePath({ codec: ICurrentScreen, defaultValue: { t: 'feed' } })

  return queryParam
}
