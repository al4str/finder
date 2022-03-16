import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { navigationMount } from '@/helpers/navigation';
import { chunksClearResourceHints } from '@/utils/chunks';

interface Props {
  children: ReactNode;
}

export function RoutesWrapper(props: Props): JSX.Element {
  const { children } = props;
  const { key } = useLocation();

  useEffect(() => {
    const route = window.location.pathname;
    navigationMount();

    return () => {
      chunksClearResourceHints(route);
    };
  }, [key]);

  return <>{children}</>;
}
