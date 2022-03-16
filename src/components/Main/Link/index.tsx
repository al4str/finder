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
    <div className={clsx('p-2 rounded-lg background-blurred', className)}>
      <Anchor
        className="btn btn-full"
        type="link"
        to={to}
      >
        <span className="flex items-center w-full">
          <span>{label}</span>
          {amount > 0 && <span>&nbsp;({amount})</span>}
          <ArrowRight className="w-4 h-4 ml-auto fill-current" />
        </span>
      </Anchor>
    </div>
  );
}
