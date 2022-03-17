import { ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  className?: string;
  pending: boolean;
  label: ReactNode;
  children: ReactNode;
}

export function CountryDetails(props: Props): JSX.Element {
  const { className = '', pending, label, children } = props;

  return (
    <div className={clsx(className)}>
      <dt className="block mb-0.5 text-sm text-gray-600 dark:text-zinc-400 sm:mb-1.5 sm:text-base">
        {label}
      </dt>
      <dd className={clsx('sm:text-xl', pending && 'skeleton')}>
        {pending ? 'Pending' : children}
      </dd>
    </div>
  );
}
