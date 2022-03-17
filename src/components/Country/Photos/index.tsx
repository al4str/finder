import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import clsx from 'clsx';
import { PhotoDataItemShort } from '@/types/photos';
import { PointerMoveHandler, usePointerMove } from '@/hooks/pointerMove';
import { useResize } from '@/hooks/resize';
import { CountryPhoto } from '@/components/Country/Photo';

const INITIAL_THRESHOLD = 10;

const DECISION_THRESHOLD = 40;

interface Context {
  prevClientX: number;
  prevClientY: number;
  scrolledEnough: boolean;
  swipedEnough: boolean;
  swipeDirection: '' | 'left' | 'right';
}

interface Props {
  className?: string;
  items: PhotoDataItemShort[];
}

export function CountryPhotos(props: Props): JSX.Element {
  const { className = '', items } = props;
  const amount = items.length;
  const showPagination = amount > 1;
  const elRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const widthRef = useRef(0);
  const indexRef = useRef(0);
  const translateRef = useRef(0);
  const [current, setCurrent] = useState(0);

  const moveTo = useCallback((nextIndex: number) => {
    const width = widthRef.current;
    const nextTranslate = -1 * nextIndex * width;
    const list = listRef.current;
    indexRef.current = nextIndex;
    translateRef.current = nextTranslate;
    if (list instanceof HTMLUListElement) {
      list.style.transform = `translate3d(${nextTranslate}px, 0, 0)`;
    }
    setCurrent(nextIndex);
  }, []);
  const handleResize = useCallback(() => {
    const el = elRef.current;
    const list = listRef.current;
    if (!(el instanceof HTMLElement)
      || !(list instanceof HTMLElement)) {
      return;
    }
    const index = indexRef.current;
    const width = el.offsetWidth;
    el.classList.remove('pointer-events-auto');
    widthRef.current = el.parentElement?.clientWidth || 0;
    list.style.width = `${amount * width}px`;
    Array
      .from(list.children)
      .forEach((item) => {
        if (item instanceof HTMLElement) {
          item.style.width = `${width}px`;
        }
      });
    moveTo(index);
    el.classList.add('pointer-events-auto');
  }, [
    amount,
    moveTo,
  ]);
  const handlePointerDown = useCallback<PointerMoveHandler<Context>>((ctx, data) => {
    ctx.current.prevClientX = data.clientX;
    ctx.current.prevClientY = data.clientY;
    ctx.current.swipedEnough = false;
    ctx.current.swipeDirection = '';
  }, []);
  const handlePointerMove = useCallback<PointerMoveHandler<Context>>((ctx, data) => {
    const prevTranslate = translateRef.current;
    const diffX = data.clientX - ctx.current.prevClientX;
    const diffY = data.clientY - ctx.current.prevClientY;
    if (!ctx.current.swipedEnough
      && Math.abs(diffY) < INITIAL_THRESHOLD
      && Math.abs(diffX) > INITIAL_THRESHOLD) {
      ctx.current.swipedEnough = true;
      window.document.body.classList.add('lock');
      data.cancelEvent();
      data.cancelPropagation();
    }
    if (ctx.current.swipedEnough) {
      const nextTranslate = prevTranslate + diffX;
      const list = listRef.current;
      if (list instanceof HTMLUListElement) {
        list.style.transform = `translate3d(${nextTranslate}px, 0, 0)`;
        list.classList.remove('transition-transform');
      }
      if (diffX <= -1 * DECISION_THRESHOLD) {
        ctx.current.swipeDirection = 'left';
      }
      else if (diffX >= DECISION_THRESHOLD) {
        ctx.current.swipeDirection = 'right';
      }
    }
  }, []);
  const handlePointerUp = useCallback<PointerMoveHandler<Context>>((ctx) => {
    window.document.body.classList.remove('lock');
    const list = listRef.current;
    if (list instanceof HTMLUListElement) {
      list.classList.add('transition-transform');
    }
    let nextIndex = indexRef.current;
    if (ctx.current.swipeDirection) {
      nextIndex = ctx.current.swipeDirection === 'left'
        ? Math.min(nextIndex + 1, amount - 1)
        : Math.max(0, nextIndex - 1);
    }
    moveTo(nextIndex);
  }, [
    amount,
    moveTo,
  ]);
  const handlePage = useCallback((nextIndex: number) => {
    moveTo(nextIndex);
  }, [
    moveTo,
  ]);

  const { onPointerDown } = usePointerMove({
    onDown: handlePointerDown,
    onMove: handlePointerMove,
    onUp: handlePointerUp,
  });

  useResize({
    onResize: !amount
      ? null
      : handleResize,
  });

  useEffect(() => {
    indexRef.current = 0;
    translateRef.current = 0;
    setCurrent(0);
  }, []);

  useLayoutEffect(() => {
    handleResize();
  }, [
    items,
    handleResize,
  ]);

  return (
    <div
      className={clsx(
        'relative select-none pointer-events-none touch-pan-y',
        className,
      )}
      ref={elRef}
      tabIndex={-1}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
    >
      <div className="w-full h-full overflow-hidden">
        <ul
          className="flex w-full h-full pointer-events-auto accelerate"
          ref={listRef}
        >
          {items.map((item, index) => (
            <li
              key={item.url}
              className={clsx(
                'relative w-full h-full',
                index === current && 'z-[1]',
              )}
            >
              <CountryPhoto
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                item={item}
              />
            </li>
          ))}
        </ul>
      </div>
      {showPagination && (
        <ul className="absolute top-0 left-0 flex justify-around w-full p-1.5 sm:px-4 sm:py-5">
          {items.map((item, index) => (
            <li
              key={item.url}
              className="w-full mr-1 sm:mr-5 last:mr-0"
            >
              <button
                className={clsx(
                  'btn btn-full h-1 rounded transition-colors pointer-events-auto sm:h-1.5',
                  index === current
                    ? 'bg-white dark:bg-zinc-700'
                    : 'bg-white/20 dark:bg-zinc-700/20',
                )}
                type="button"
                tabIndex={-1}
                onClick={() => handlePage(index)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
