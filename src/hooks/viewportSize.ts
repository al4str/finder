import { Dispatch, SetStateAction, useState, useEffect } from 'react';

export interface ViewportSize {
  width: number;
  height: number;
  visualWidth: number;
  visualHeight: number;
  visualScale: number;
}

const subscribersSet = new Set<Dispatch<SetStateAction<ViewportSize>>>();

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

const visualViewport: null | VisualViewport = 'visualViewport' in window
  ? window.visualViewport
  : null;

function attachListener() {
  if (visualViewport && 'addEventListener' in visualViewport) {
    visualViewport.addEventListener('resize', handleResize, { passive: true });
  }
  else {
    window.addEventListener('resize', handleResize, { passive: true });
  }
}

attachListener();

export function viewportGetSize(): ViewportSize {
  const nextSize = {
    width: window.innerWidth,
    height: window.innerHeight,
    visualWidth: window.innerWidth,
    visualHeight: window.innerHeight,
    visualScale: 1,
  };
  if (visualViewport !== null) {
    nextSize.visualWidth = visualViewport.width;
    nextSize.visualHeight = visualViewport.height;
    nextSize.visualScale = visualViewport.scale;
  }

  return nextSize;
}
