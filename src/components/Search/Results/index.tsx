import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { CountryDataItemShort } from '@/types/countries';
import { scrollToY } from '@/utils/scroll';
import { fuzzy } from '@/helpers/fuzzy';
import { searchHide, useSearchStore } from '@/helpers/search';
import { ListItems } from '@/components/List/Items';

interface Props {
  className?: string;
}

export function SearchResults(props: Props): JSX.Element {
  const { className = '' } = props;
  const { key } = useLocation();
  const { searching, ready, active, query, names, results } = useSearchStore();

  const resultItems = useMemo<CountryDataItemShort[]>(() => {
    const namesItems = Array.from(names);
    const mappedItems = Array
      .from(results)
      .reduce((result, code) => {
        const item = namesItems.find((nameItem) => nameItem.cca2 === code);
        if (item) {
          return result.concat([item]);
        }
        return result;
      }, [] as CountryDataItemShort[]);

    return fuzzy(query, mappedItems);
  }, [query, names, results]);

  useEffect(() => {
    if (active && ready) {
      scrollToY(window.document.documentElement.scrollHeight);
    }
  }, [active, ready]);
  useEffect(() => {
    searchHide();
  }, [key]);

  if (!active) {
    return <></>;
  }
  return (
    <div
      className={clsx('mx-3 p-2 rounded-lg background', className)}
      id="search-results"
    >
      {searching && (
        <p>Searching..</p>
      )}
      {ready && (
        <ListItems items={resultItems} />
      )}
    </div>
  );
}
