import { MutableRefObject, RefCallback, useCallback } from 'react';

type RefAny<T> = null | MutableRefObject<T> | RefCallback<T>;

export function useSetRef<T = null>(refs: RefAny<T>[]): RefCallback<T> {
  return useCallback((element) => {
    if (element instanceof HTMLElement) {
      setRefs(element, refs);
    }
  }, [
    refs,
  ]);
}

function setRefs<T>(element: T, refs: RefAny<T>[]): void {
  if (element instanceof HTMLElement) {
    refs.forEach((ref) => {
      if (ref
        && typeof ref === 'object'
        && 'current' in ref) {
        ref.current = element;
      }
      if (typeof ref === 'function') {
        ref(element);
      }
    });
  }
}
