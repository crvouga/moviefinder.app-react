import { usePath } from '~/@/use-path'
import { ICurrentScreen } from './current-screen'

export const useCurrentScreen = () => {
  const queryParam = usePath({ codec: ICurrentScreen, defaultValue: { t: 'feed' } })

  return queryParam
}
