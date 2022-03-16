import { useCallback } from 'react';
import clsx from 'clsx';
import {
  colorSchemeGetState,
  colorSchemeApply,
  useColorScheme,
} from '@/hooks/colorScheme';
import styles from './styles.module.css';

interface Props {
  className?: string;
}

export function HeaderColorScheme(props: Props): JSX.Element {
  const { className = '' } = props;
  const { actual } = useColorScheme();
  const label = actual === 'dark'
    ? 'Apply light mode'
    : 'Apply dark mode';
  const icon = actual === 'dark'
    ? styles.iconSun
    : styles.iconMoon;

  const handleApply = useCallback(() => {
    if (colorSchemeGetState().actual === 'dark') {
      colorSchemeApply('light');
      return;
    }
    colorSchemeApply('dark');
  }, []);

  return (
    <button
      className={clsx('btn btn-small btn-flat', className)}
      type="button"
      title={label}
      aria-label={label}
      onClick={handleApply}
    >
      <span className="btn-wrp">
        <span className={clsx('btn-icon bg-center bg-no-repeat bg-contain', icon)} />
      </span>
    </button>
  );
}
