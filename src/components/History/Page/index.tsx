import { useMemo, useCallback } from 'react';
import { CountryDataItemShort } from '@/types/countries';
import { useSearchStore } from '@/helpers/search';
import { useHistory } from '@/helpers/history';
import { Page } from '@/components/Page';
import { ListItems } from '@/components/List/Items';
import Bin from '@/components/Icons/bin.svg';

export function HistoryPage(): JSX.Element {
  const { pending, ready, names } = useSearchStore();
  const [history, setHistory] = useHistory();

  const historyItems = useMemo<CountryDataItemShort[]>(() => {
    const namesItems = Array.from(names);
    return history.reduce((result, code) => {
      const item = namesItems.find((nameItem) => nameItem.cca2 === code);
      if (item) {
        return result.concat([item]);
      }
      return result;
    }, [] as CountryDataItemShort[]);
  }, [names, history]);
  const hasItems = historyItems.length > 0;

  const handleRemove = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return (
    <Page className="mx-3 p-2 rounded-lg background">
      <div className="flex items-center mb-1">
        <h1 className="heading">Search history</h1>
        {hasItems && (
          <button
            className="ml-auto btn btn-small btn-flat"
            type="button"
            aria-label="Clear your search history"
            onClick={handleRemove}
          >
            <span className="btn-wrp">
              <Bin className="btn-icon" />
            </span>
          </button>
        )}
      </div>
      {pending && (
        <p>
          Loading list..
        </p>
      )}
      {ready && (
        <ListItems items={historyItems} />
      )}
      {ready && !hasItems && (
        <p className="py-6 text-center text-sm text-gray-600">
          Nothing there yet
        </p>
      )}
    </Page>
  );
}
