import throttle from 'lodash.throttle';
import { Dispatch, SetStateAction, useRef, useState, useEffect } from 'react';
import { idGet } from '@/utils/id';

interface StoreResult<T, A> {
  getState: () => T;
  dispatch: (type: A, payload: Partial<T>) => void;
  useStore: () => void;
}

interface StoreReducer<T, A> {
  (prevState: T, action: { type: A; payload: T }): T;
}

export function storeCreate<T, A = string>(
  initialState: T,
  reducer: StoreReducer<T, A>,
): StoreResult<T, A> {
  let innerState = initialState;

  const subscribers = new Map<string,
    Dispatch<SetStateAction<Record<string, never>>>>();

  const throttledSubscribersUpdate = throttle(
    () => {
      subscribers.forEach((subscriber) => {
        subscriber({});
      });
    },
    1000 / 60,
    {
      leading: true,
      trailing: true,
    },
  );

  function useStore() {
    const keyRef = useRef(idGet(8));
    const [, forceRender] = useState({});

    useEffect(() => {
      const key = keyRef.current;
      subscribers.set(key, forceRender);

      return () => {
        subscribers.delete(key);
      };
    }, []);
  }

  function getState() {
    return innerState;
  }

  function dispatch(type: A, payload: T) {
    const prevState = innerState;
    const nextState = reducer(innerState, {
      type,
      payload,
    });
    const stateChanged = nextState !== prevState;
    innerState = nextState;
    if (stateChanged) {
      throttledSubscribersUpdate();
    }
  }

  return {
    getState,
    dispatch,
    useStore,
  };
}
