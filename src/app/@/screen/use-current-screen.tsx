import { usePath } from '~/@/use-path'
import { Screen } from './screen'

export const useCurrentScreen = () => {
  const queryParam = usePath({ codec: Screen, defaultValue: { t: 'feed' } })

  return queryParam
}
