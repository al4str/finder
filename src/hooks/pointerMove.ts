import {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  MutableRefObject,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { eventsOptions } from '@/utils/events';

export type PointerMoveEvent = TouchEvent | MouseEvent
  | ReactMouseEvent<HTMLElement> | ReactTouchEvent<HTMLElement>;

export interface PointerMoveData {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  cancelEvent: () => void;
  cancelPropagation: () => void;
}

export type PointerMoveContext<T = Record<string, unknown>> = T & {
  __handlers: {
    handlePointerMove: (event: PointerMoveEvent) => void;
    handlePointerUp: (event: PointerMoveEvent) => void;
  };
}

export type PointerMoveHandler<T> = (
  contextRef: MutableRefObject<PointerMoveContext<T>>,
  data: PointerMoveData,
  event: PointerMoveEvent,
) => void;

const E_OPT = eventsOptions({
  passive: false,
});

interface Params<T> {
  onDown: PointerMoveHandler<T>;
  onMove: PointerMoveHandler<T>;
  onUp: PointerMoveHandler<T>;
}

interface Results {
  onPointerDown: (event: PointerMoveEvent) => void;
}

export function usePointerMove<T>(params: Params<T>): Results {
  const {
    onDown,
    onMove,
    onUp,
  } = params;
  const contextRef = useRef<PointerMoveContext<T>>(getEmptyContext());

  const handlePointerMove = useCallback((e: PointerMoveEvent) => {
    if (typeof onMove === 'function') {
      onMove(contextRef, getDataFromEvent(e), e);
    }
  }, [
    onMove,
  ]);
  const handlePointerUp = useCallback((e: PointerMoveEvent) => {
    if (typeof onUp === 'function') {
      onUp(contextRef, getDataFromEvent(e), e);
    }
    window.document.removeEventListener('touchmove', handlePointerMove, E_OPT);
    window.document.removeEventListener('mousemove', handlePointerMove, E_OPT);
    window.document.removeEventListener('touchend', handlePointerUp, E_OPT);
    window.document.removeEventListener('touchcancel', handlePointerUp, E_OPT);
    window.document.removeEventListener('mouseup', handlePointerUp, E_OPT);
    contextRef.current = getEmptyContext();
  }, [
    onUp,
    handlePointerMove,
  ]);
  const handlePointerDown = useCallback((e: PointerMoveEvent) => {
    if (isMultiFingerTouch(e)) {
      return;
    }
    if (typeof onDown === 'function') {
      onDown(contextRef, getDataFromEvent(e), e);
    }
    contextRef.current.__handlers = {
      handlePointerMove,
      handlePointerUp,
    };
    window.document.addEventListener('touchmove', handlePointerMove, E_OPT);
    window.document.addEventListener('mousemove', handlePointerMove, E_OPT);
    window.document.addEventListener('touchend', handlePointerUp, E_OPT);
    window.document.addEventListener('touchcancel', handlePointerUp, E_OPT);
    window.document.addEventListener('mouseup', handlePointerUp, E_OPT);
  }, [
    onDown,
    handlePointerUp,
    handlePointerMove,
  ]);

  useEffect(() => {
    const handlers = contextRef.current.__handlers || {};

    return () => {
      const moveHandler = handlers.handlePointerMove;
      const upHandler = handlers.handlePointerUp;
      if (typeof moveHandler === 'function') {
        window.document.removeEventListener('touchmove', moveHandler, E_OPT);
        window.document.removeEventListener('mousemove', moveHandler, E_OPT);
      }
      if (typeof upHandler === 'function') {
        window.document.removeEventListener('touchend', upHandler, E_OPT);
        window.document.removeEventListener('touchcancel', upHandler, E_OPT);
        window.document.removeEventListener('mouseup', upHandler, E_OPT);
      }
    };
  }, []);

  return {
    onPointerDown: handlePointerDown,
  };
}

function isMultiFingerTouch(e: PointerMoveEvent): e is TouchEvent {
  return ('targetTouches' in e && e.targetTouches.length > 1);
}

function cancelEvent(e: PointerMoveEvent): void {
  if (e.cancelable) {
    e.preventDefault();
  }
}

function cancelPropagation(e: PointerMoveEvent): void {
  e.stopPropagation();
}

function getDataFromEvent(e: PointerMoveEvent): PointerMoveData {
  const event = 'changedTouches' in e
    ? e.changedTouches[0]
    : e;
  if (event) {
    return {
      clientX: event.clientX,
      clientY: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      cancelEvent: () => cancelEvent(e),
      cancelPropagation: () => cancelPropagation(e),
    };
  }
  return {
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    cancelEvent: () => undefined,
    cancelPropagation: () => undefined,
  };
}

function getEmptyContext<T>(): PointerMoveContext<T> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return {
    __handlers: {
      handlePointerMove: () => undefined,
      handlePointerUp: () => undefined,
    },
  };
}
