import { memo, useRef, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { equal } from '@/utils/equal';
import { searchExec, useSearchStore } from '@/helpers/search';
import { Input } from '@/components/UI/Input';
import Magnifier from '@/components/Icons/magnifier.svg';
import Cross from '@/components/Icons/cross.svg';

interface Props {
  className?: string;
  query: string;
}

function Field(props: Props): JSX.Element {
  const { className = '', query } = props;
  const timerRef = useRef(-1);
  const fieldRef = useRef<HTMLInputElement>(null);
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
    const notFocused = window.document.activeElement !== field;
    if (field instanceof HTMLInputElement && notFocused) {
      field.value = query;
    }
  }, [query]);
  useEffect(() => {
    const field = fieldRef.current;

    return () => {
      if (field instanceof HTMLInputElement) {
        field.value = '';
        void searchExec('');
      }
    };
  }, []);

  return (
    <div className={clsx('relative', className)}>
      <label
        className="sr-only"
        htmlFor="search-field"
      >
        Search for country
      </label>
      <Input
        className="peer field h-10 w-full pl-8 pr-3 font-medium text-gray-900 placeholder-gray-400 border border-transparent bg-gray-200 rounded-lg ring-0 focus:text-gray-900 focus:border-blue-600 hover:bg-white focus:bg-white dark:text-white dark:placeholder-zinc-500 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700 transition-colors sm:h-12 sm:pl-10"
        id="search-field"
        ref={fieldRef}
        name="search"
        autoComplete="off"
        inputMode="search"
        placeholder="Search"
      />
      <span className="absolute top-3 left-3 mr-2 text-gray-400 dark:text-zinc-500 transition-colors pointer-events-none">
        <Magnifier className="w-4 h-4 fill-current sm:w-6 sm:h-6" />
      </span>
      {hasQuery && (
        <button
          className="action absolute top-3 right-3 h-4 w-4 text-gray-300 dark:text-zinc-500 sm:w-6 sm:h-6"
          type="button"
          aria-label="Clear search input"
          onClick={handleClear}
        >
          <Cross className="w-4 h-4 fill-current sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
}

type OutProps = Omit<Props, 'query'>;

export const SearchField = memo((props: OutProps): JSX.Element => {
  const Wrapped = memo((innerProps: OutProps): JSX.Element => {
    const { query } = useSearchStore();

    return (
      <Field query={query} {...innerProps} />
    );
  }, equal);

  return (
    <Wrapped {...props} />
  );
}, equal);
