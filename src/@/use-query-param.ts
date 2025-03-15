import { useEffect, useState } from 'react';
import { Codec } from './codec';

export const useQueryParam = <T>(config: { param: string; defaultValue: T; codec: Codec<T> }) => {
  const { param, defaultValue } = config;
  const searchParams = useSearchParams();
  const value = searchParams.get(param) || defaultValue;
  return value;
};

const useSearchParams = (): URLSearchParams => {
  const [searchParams, setSearchParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params;
  });

  useEffect(() => {
    const handlePopState = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return searchParams;
};
