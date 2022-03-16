import {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { jsonSafeParse, jsonSafeStringify } from '@/utils/json';

export type LocalStorageResult<T> = [T, Dispatch<SetStateAction<T>>];

export function useLocalStorage<T>(
  key: string,
  fallback: T,
): LocalStorageResult<T> {
  const [value, setValue] = useState<T>(() => {
    return localStorageGet(key, fallback);
  });
  const valueRef = useRef(value);

  const handleStorageChange = useCallback(() => {
    setValue(localStorageGet(key, fallback));
  }, [key, fallback]);

  const handleSet = useCallback(
    (valueUpdater: SetStateAction<T>) => {
      const prevValue = valueRef.current;
      const nextValue = valueUpdater instanceof Function
        ? valueUpdater(prevValue)
        : valueUpdater;
      localStorageSet(key, nextValue);
      handleStorageUpdate(handleStorageChange);
    },
    [key, handleStorageChange],
  );

  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  useEffect(() => {
    subscriberAdd(handleStorageChange);
    return () => {
      subscriberDelete(handleStorageChange);
    };
  }, [handleStorageChange]);

  return [value, handleSet];
}

export function localStorageGet<T>(
  key: string,
  fallback: T,
  defaultWhenNull = true,
): T {
  const value = jsonSafeParse<T>(
    window.localStorage.getItem(key) || '',
    fallback,
  );
  return defaultWhenNull && value === null
    ? fallback
    : value;
}

export function localStorageSet<T>(key: string, nextValue: T): void {
  const nextValueString = jsonSafeStringify({ data: nextValue });
  window.localStorage.setItem(key, nextValueString);
}

type LocalStorageGet<T> = (key: string, defaultValue: T) => T;

type LocalStorageSet<T> = (key: string, nextValue: T) => void;

export type LocalStorageSubscriber<T> = (
  get: LocalStorageGet<T>,
  set: LocalStorageSet<T>,
  unsubscribe: () => void,
) => void;

export function localStorageSubscribe<T>(
  subscriber: LocalStorageSubscriber<T>,
): void {
  if (typeof subscriber === 'function') {
    subscriberAdd(function handler() {
      subscriber(localStorageGet, localStorageSet, () => {
        subscriberDelete(handler);
      });
    });
  }
}

const subscribersMap = new Set<() => void>();

function subscriberAdd(subscriber: () => void) {
  subscribersMap.add(subscriber);
}

function subscriberDelete(subscriber: () => void) {
  subscribersMap.delete(subscriber);
}

function handleStorageUpdate(ignoredSubscriber?: () => void) {
  subscribersMap.forEach((subscriber) => {
    if (ignoredSubscriber !== subscriber) {
      subscriber();
    }
  });
}

window.addEventListener('storage', () => {
  handleStorageUpdate();
});
