import clsx from 'clsx';
import { navigationGoBack } from '@/helpers/navigation';
import ArrowRight from '@/components/Icons/arrowRight.svg';

interface Props {
  className?: string;
  type: 'flat' | 'blurred';
}

export function BackAction(props: Props): JSX.Element {
  const { className = '', type } = props;

  return (
    <button
      className={clsx(
        'btn',
        type === 'flat' && 'btn-flat',
        type === 'blurred' && 'btn-blurred',
        className,
      )}
      type="button"
      aria-label="Go back"
      onClick={navigationGoBack}
    >
      <span className="btn-wrp">
        <ArrowRight className="btn-icon rotate-180" />
      </span>
    </button>
  );
}
