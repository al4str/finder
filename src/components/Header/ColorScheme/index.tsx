import { useCallback } from 'react';
import clsx from 'clsx';
import {
  colorSchemeGetState,
  colorSchemeApply,
  useColorScheme,
} from '@/hooks/colorScheme';
import Sun from '@/components/Icons/sun.svg';
import Moon from '@/components/Icons/moon.svg';

interface Props {
  className?: string;
}

export function HeaderColorScheme(props: Props): JSX.Element {
  const { className = '' } = props;
  const { actual } = useColorScheme();
  const label = actual === 'dark'
    ? 'Apply light mode'
    : 'Apply dark mode';
  const Icon = actual === 'dark'
    ? Sun
    : Moon;

  const handleApply = useCallback(() => {
    if (colorSchemeGetState().actual === 'dark') {
      colorSchemeApply('light');
      return;
    }
    colorSchemeApply('dark');
  }, []);

  return (
    <button
      className={clsx('btn btn-blurred', className)}
      type="button"
      title={label}
      aria-label={label}
      onClick={handleApply}
    >
      <span className="btn-wrp">
        <Icon className="btn-icon" />
      </span>
    </button>
  );
}
