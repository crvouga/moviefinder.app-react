import { Codec } from './codec';

export const useQueryParam = <T>(config: { param: string; defaultValue: T; codec: Codec<T> }) => {
  const { param, defaultValue } = config;
  const searchParams = useSearchParams();
  const value = searchParams.get(param) || defaultValue;
  return value;
};
