import { useEffect } from 'react';
import { eventsOptions } from '@/utils/events';

const E_OPT = eventsOptions({
  passive: true,
});

interface Params {
  mounted?: boolean;
  onResize: null | (() => void);
}

export function useResize(params: Params): void {
  const { mounted = false, onResize } = params;

  useEffect(() => {
    const valid = typeof onResize === 'function';
    if (valid) {
      onResize();
      window.addEventListener('resize', onResize, E_OPT);
    }

    return () => {
      if (valid) {
        window.removeEventListener('resize', onResize, E_OPT);
      }
    };
  }, [
    mounted,
    onResize,
  ]);
}
