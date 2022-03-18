import { useMemo, useCallback } from 'react';
import { CountryDataItemShort } from '@/types/countries';
import { useSearchStore } from '@/helpers/search';
import { useFavorites } from '@/helpers/favorites';
import { Page } from '@/components/Page';
import { BackAction } from '@/components/UI/Back';
import { ListItems } from '@/components/List/Items';
import Bin from '@/components/Icons/bin.svg';

export function FavoritesPage(): JSX.Element {
  const { pending, ready, names } = useSearchStore();
  const [favorites, setFavorites] = useFavorites();

  const favoritesItems = useMemo<CountryDataItemShort[]>(() => {
    const namesItems = Array.from(names);
    return favorites.reduce((result, code) => {
      const item = namesItems.find((nameItem) => nameItem.cca2 === code);
      if (item) {
        return result.concat([item]);
      }
      return result;
    }, [] as CountryDataItemShort[]);
  }, [names, favorites]);
  const hasItems = favoritesItems.length > 0;

  const handleRemove = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return (
    <Page className="mx-3 p-2 rounded-lg background-blurred sm:mx-5 sm:px-4 sm:pb-4 sm:rounded-2xl">
      <div className="flex items-center mb-1 sm:mb-2">
        <BackAction
          className="shrink-0 mr-1"
          type="flat"
        />
        <h1 className="heading text-lg sm:text-3xl">
          Favorite countries
        </h1>
        {hasItems && (
          <button
            className="ml-auto btn btn-flat"
            type="button"
            aria-label="Clear favorites list"
            onClick={handleRemove}
          >
            <span className="btn-wrp">
              <Bin className="btn-icon" />
            </span>
          </button>
        )}
      </div>
      {pending && (
        <p className="message">
          Loading list..
        </p>
      )}
      {ready && (
        <ListItems items={favoritesItems} />
      )}
      {ready && !hasItems && (
        <p className="message">
          Nothing there yet
        </p>
      )}
    </Page>
  );
}
