import { ChangeEvent, useCallback } from 'react';
import clsx from 'clsx';
import { SearchBy, searchSetBy, useSearchStore } from '@/helpers/search';
import ArrowDown from '@/components/Icons/arrowDown.svg';

interface Option {
  label: string;
  value: SearchBy;
}

const OPTIONS: Option[] = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Code',
    value: 'alpha',
  },
  {
    label: 'Currency',
    value: 'currency',
  },
  {
    label: 'Language',
    value: 'lang',
  },
  {
    label: 'Capital',
    value: 'capital',
  },
  {
    label: 'Region',
    value: 'region',
  },
  {
    label: 'Subregion',
    value: 'subregion',
  },
];

interface Props {
  className?: string;
}

export function SearchBySelect(props: Props): JSX.Element {
  const { className = '' } = props;
  const { by } = useSearchStore();

  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const nextBy = e.target.value as SearchBy;
    searchSetBy(nextBy);
  }, []);

  return (
    <div className={clsx('flex items-center', className)}>
      <span className="text-sm mr-1 dark:text-zinc-300 sm:mr-2 sm:text-base">Search by:</span>
      <div className="relative">
        <select
          className="btn btn-full pl-2 pr-6 bg-gray-200 hover:bg-white dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg sm:pl-3"
          id="search-by"
          value={by}
          onChange={handleChange}
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ArrowDown className="absolute top-0 right-0 w-5 h-5 m-1.5 btn-icon pointer-events-none sm:w-7 sm:h-7 sm:m-2.5" />
      </div>
      <label
        className="sr-only"
        htmlFor="search-by"
      >
        Choose by which field search will be executed
      </label>
    </div>
  );
}
