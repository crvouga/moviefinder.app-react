import { useQueryParam } from '~/@/use-query-param';
import { Screen } from './screen';

export const useCurrentScreen = () => {
  const queryParam = useQueryParam({
    param: 'screen',
    codec: Screen,
    defaultValue: {
      type: 'home',
    },
  });

  return queryParam;
};
