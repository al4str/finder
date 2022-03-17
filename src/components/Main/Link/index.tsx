import clsx from 'clsx';
import { Anchor } from '@/components/UI/Anchor';
import ArrowRight from '@/components/Icons/arrowRight.svg';

interface Props {
  className?: string;
  to: string;
  label: string;
  amount?: number;
}

export function MainLink(props: Props): JSX.Element {
  const {
    className = '',
    to,
    label,
    amount = 0,
  } = props;

  return (
    <div className={clsx('', className)}>
      <Anchor
        className="btn btn-full block rounded-lg background-blurred sm:p-3"
        type="link"
        to={to}
      >
        <span className="flex items-center w-full h-full">
          <span>{label}</span>
          {amount > 0 && <span>&nbsp;({amount})</span>}
          <ArrowRight className="w-4 h-4 ml-auto fill-current sm:w-6 sm:h-6" />
        </span>
      </Anchor>
    </div>
  );
}
