import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { CountryDataItemShort } from '@/types/countries';
import { scrollToY } from '@/utils/scroll';
import { fuzzy } from '@/helpers/fuzzy';
import { searchHide, useSearchStore } from '@/helpers/search';
import { ListItems } from '@/components/List/Items';
import { SearchBySelect } from '@/components/Search/BySelect';

interface Props {
  className?: string;
}

export function SearchResults(props: Props): JSX.Element {
  const { className = '' } = props;
  const { key } = useLocation();
  const { searching, ready, notFound, active, by, query, names, results } = useSearchStore();

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

    if (by === 'name') {
      return fuzzy(query, mappedItems);
    }
    return mappedItems;
  }, [by, query, names, results]);

  useEffect(() => {
    if (!active) {
      return;
    }
    const root = window.document.documentElement;
    const body = window.document.body;
    const elResults = window.document.getElementById('search-results');
    const elSearch = window.document.getElementById('search');
    if (elResults instanceof HTMLElement && elSearch instanceof HTMLElement) {
      const nextScroll = root.classList.contains('ios')
        ? window.scrollY
          + elResults.getBoundingClientRect().bottom
          + elSearch.getBoundingClientRect().height
          + 24
          - window.innerHeight
        : body.scrollHeight;
      scrollToY(nextScroll);
    }
  }, [active, resultItems]);
  useEffect(() => {
    searchHide();
  }, [key]);

  if (!active) {
    return <></>;
  }
  return (
    <div
      className={clsx('mx-3 p-2 rounded-lg background-blurred sm:mx-5 sm:p-4 sm:rounded-2xl', className)}
      id="search-results"
    >
      {searching && (
        <p className="message">Searching..</p>
      )}
      {notFound && (
        <p className="message">Nothing found</p>
      )}
      {ready && (
        <ListItems items={resultItems} />
      )}
      <SearchBySelect className="mt-3 pl-1 sm:pl-2" />
    </div>
  );
}
