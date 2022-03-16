import { ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  className?: string;
  children: ReactNode;
}

export function Page(props: Props): JSX.Element {
  const {
    className = '',
    children,
  } = props;

  return (
    <div className={clsx('mt-3', className)} id="page">
      {children}
    </div>
  );
}
