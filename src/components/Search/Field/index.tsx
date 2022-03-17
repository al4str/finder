import { useRef, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { Input } from '@/components/UI/Input';
import { searchExec, useSearchStore } from '@/helpers/search';
import Magnifier from '@/components/Icons/magnifier.svg';
import Cross from '@/components/Icons/cross.svg';

interface Props {
  className?: string;
}

export function SearchField(props: Props): JSX.Element {
  const { className = '' } = props;
  const timerRef = useRef(-1);
  const fieldRef = useRef<HTMLInputElement>(null);
  const { query } = useSearchStore();
  const hasQuery = Boolean(query);

  const handleClear = useCallback(() => {
    const field = fieldRef.current;
    void searchExec('');
    if (field instanceof HTMLInputElement) {
      field.value = '';
    }
  }, []);
  const handleSearch = useCallback(() => {
    const field = fieldRef.current;
    if (field instanceof HTMLInputElement) {
      const nextQuery = field.value.trim();
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        void searchExec(nextQuery);
      }, 150);
    }
  }, [fieldRef]);

  useEffect(() => {
    const field = fieldRef.current;
    if (field instanceof HTMLInputElement) {
      field.addEventListener('input', handleSearch);
    }

    return () => {
      if (field instanceof HTMLInputElement) {
        field.removeEventListener('input', handleSearch);
      }
    };
  }, [handleSearch]);
  useEffect(() => {
    const field = fieldRef.current;
    if (field instanceof HTMLInputElement
      && window.document.activeElement !== field) {
      field.value = query;
    }

    return () => {
      if (field instanceof HTMLInputElement) {
        field.value = '';
      }
    };
  }, [query]);

  return (
    <div className={clsx('relative', className)}>
      <label
        className="sr-only"
        htmlFor="search-field"
      >
        Search for country
      </label>
      <Input
        className="field h-10 w-full pl-8 pr-3 text-base font-medium text-gray-900 placeholder-gray-400 border border-transparent bg-white rounded-lg ring-0 focus:text-gray-900 focus:border-blue-600 focus:bg-white dark:text-white dark:caret-blue-500 dark:focus:border-blue-500 transition-colors"
        id="search-field"
        ref={fieldRef}
        name="search"
        autoComplete="off"
        inputMode="search"
        placeholder="Search"
      />
      <span className="absolute top-3 left-3 mr-2 text-gray-400 dark:text-zinc-500 transition-colors pointer-events-none">
        <Magnifier className="w-4 h-4 fill-current" />
      </span>
      {hasQuery && (
        <button
          className="action absolute top-3 right-3 h-4 w-4 text-gray-300 dark:text-zinc-500"
          type="button"
          aria-label="Clear search input"
          onClick={handleClear}
        >
          <Cross className="w-4 h-4 fill-current" />
        </button>
      )}
    </div>
  );
}
