import {
  AnchorHTMLAttributes,
  ReactNode,
  forwardRef,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  Location,
  useLocation,
  NavLink,
  Link,
} from 'react-router-dom';
import clsx from 'clsx';
import { chunksAddResourceHints } from '@/utils/chunks';
import { useSetRef } from '@/hooks/setRef';

export interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  activeClassName?: string;
  isActive?: (location: Location) => boolean;
  type?: 'link' | 'nav' | 'anchor';
  qa?: string;
  to: string;
  children: ReactNode;
}

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>((props, ref): JSX.Element => {
  const {
    className = '',
    activeClassName = '',
    isActive = null,
    type = 'link',
    qa = '',
    to,
    children,
    ...restProps
  } = props;
  const location = useLocation();
  const elRef = useRef<HTMLAnchorElement>(null);
  const setRef = useSetRef([ref, elRef]);

  const navClassName = useCallback<NavClassGetter>((navParams) => {
    const active = typeof isActive === 'function'
      ? isActive(location)
      : navParams.isActive;

    return clsx(
      className,
      active && activeClassName,
    );
  }, [isActive, className, activeClassName, location]);

  useEffect(() => {
    const link = elRef.current;
    if (link instanceof HTMLAnchorElement && link.host === window.location.host) {
      observe(link);
    }

    return () => {
      if (link instanceof HTMLAnchorElement) {
        unobserve(link);
      }
    };
  }, [
  ]);

  switch (type) {
    case 'link':
      return (
        <Link
          className={className}
          ref={setRef}
          to={to}
          data-qa={qa}
          {...restProps}
        >
          {children}
        </Link>
      );
    case 'nav':
      return (
        <NavLink
          className={navClassName}
          ref={setRef}
          to={to}
          data-qa={qa}
          {...restProps}
        >
          {children}
        </NavLink>
      );
    case 'anchor':
      return (
        <a
          className={className}
          ref={setRef}
          href={to}
          data-qa={qa}
          {...restProps}
        >
          {children}
        </a>
      );
    default:
      return <></>;
  }
});

Anchor.displayName = 'Anchor';

type NavClassGetter = ({ isActive }: { isActive: boolean }) => string;

let observer = {
  observe(el: HTMLAnchorElement) {
    el.addEventListener('touchstart', handlePointerDown);
    el.addEventListener('mousedown', handlePointerDown);
  },
  unobserve(el: HTMLAnchorElement) {
    el.removeEventListener('touchstart', handlePointerDown);
    el.removeEventListener('mousedown', handlePointerDown);
  },
};

if ('IntersectionObserver' in window) {
  observer = new window.IntersectionObserver(handleObserve);
}

function observe(el: HTMLAnchorElement) {
  observer.observe(el);
}

function unobserve(el: HTMLAnchorElement) {
  observer.unobserve(el);
}

function handlePointerDown(e: TouchEvent | MouseEvent) {
  const link = e.target;
  if (link instanceof HTMLAnchorElement) {
    chunksAddResourceHints(link.pathname, 'preload');
  }
}

function handleObserve(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    const link = entry.target;
    if (link instanceof HTMLAnchorElement && entry.isIntersecting) {
      chunksAddResourceHints(link.pathname, 'prefetch');
    }
  });
}
