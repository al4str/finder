import clsx from 'clsx';

interface Props {
  className?: string;
}

export function CountryNotFound(props: Props): JSX.Element {
  const { className = '' } = props;

  return (
    <p className={clsx('message', className)}>Not found</p>
  );
}
