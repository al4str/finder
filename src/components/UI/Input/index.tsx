import { ChangeEvent, InputHTMLAttributes, forwardRef, useCallback } from 'react';
import clsx from 'clsx';

type InputType = InputHTMLAttributes<HTMLInputElement>;

interface Props extends Omit<InputType, 'value' | 'onChange'> {
  value?: string;
  onChange?: (nextValue: string) => void;
}

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    className = '',
    inputMode,
    value,
    onChange,
    ...restProps
  } = props;

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { target: { value: nextValue } } = e;
    if (typeof onChange === 'function') {
      onChange(nextValue);
    }
  }, [
    onChange,
  ]);

  return (
    <input
      className={clsx('field', className)}
      ref={ref}
      inputMode={inputMode}
      value={value}
      onChange={handleChange}
      {...restProps}
    />
  );
});
