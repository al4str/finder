import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { eventsOptions } from '@/utils/events';

const E_OPT = eventsOptions({
  passive: true,
});

export interface ViewportSize {
  width: number;
  height: number;
  visualWidth: number;
  visualHeight: number;
  visualScale: number;
}

const subscribersSet = new Set<Dispatch<SetStateAction<ViewportSize>>>();

const visualViewport: null | VisualViewport = 'visualViewport' in window
  ? window.visualViewport
  : null;

export const viewportInit = attachListener;

export function viewportGetSize(): ViewportSize {
  const nextSize = {
    width: window.innerWidth,
    height: window.innerHeight,
    visualWidth: window.innerWidth,
    visualHeight: window.innerHeight,
    visualScale: 1,
  };
  if (visualViewport instanceof VisualViewport) {
    nextSize.visualWidth = visualViewport.width;
    nextSize.visualHeight = visualViewport.height;
    nextSize.visualScale = visualViewport.scale;
  }

  return nextSize;
}

export function useViewportSize(): ViewportSize {
  const [viewportSize, setViewportSize] = useState<ViewportSize>({
    width: 0,
    height: 0,
    visualWidth: 0,
    visualHeight: 0,
    visualScale: 1,
  });

  useEffect(() => {
    setViewportSize(viewportGetSize());
  }, []);
  useEffect(() => {
    if (!subscribersSet.has(setViewportSize)) {
      subscribersSet.add(setViewportSize);
    }
    return () => {
      subscribersSet.delete(setViewportSize);
    };
  }, []);

  return viewportSize;
}

function attachListener() {
  handleResize();
  if (visualViewport && 'addEventListener' in visualViewport) {
    visualViewport.addEventListener('resize', handleResize, E_OPT);
  }
  else {
    window.addEventListener('resize', handleResize, E_OPT);
  }
}

function handleResize(): void {
  const nextSize = viewportGetSize();
  publishSize(nextSize);
}

function publishSize(size: ViewportSize): void {
  subscribersSet.forEach((subscriber) => {
    subscriber((prevSize) => {
      if (size.width === prevSize.width && size.height === prevSize.height) {
        return prevSize;
      }
      return size;
    });
  });
}
