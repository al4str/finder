import { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { scrollToY } from '@/utils/scroll';
import { ROUTES, routesReplace } from '@/helpers/routes';
import { useFavorites } from '@/helpers/favorites';
import { useHistory } from '@/helpers/history';
import { Page } from '@/components/Page';
import { MainLink } from '@/components/Main/Link';
import { useSearchStore } from '@/helpers/search';
import { randomNumber } from '@/utils/random';
import { SearchResults } from '@/components/Search/Results';
import { SearchBar } from '@/components/Search/Bar';
import styles from './styles.module.css';

export function MainPage(): JSX.Element {
  const [favorites] = useFavorites();
  const [history] = useHistory();
  const { names } = useSearchStore();
  const randomIndexRef = useRef(randomNumber(0, names.size));
  const item = Array.from(names)[randomIndexRef.current];
  const hasItem = Boolean(item);
  const luckyCode = (item?.cca2 || '').toLowerCase();
  const luckyLink = routesReplace(ROUTES.country, { code: luckyCode });

  useEffect(() => {
    scrollToY(window.document.body.scrollHeight);
  }, []);

  return (
    <>
      <Page className="mx-3 sm:mx-5">
        <MainLink
          to={luckyLink}
          label={hasItem ? 'Feeling lucky' : 'Randomizing..'}
        />
        <MainLink
          className="mt-3"
          to={ROUTES.favorites}
          label="Your favorites"
          amount={favorites.length}
        />
        <MainLink
          className="mt-3"
          to={ROUTES.history}
          label="Your search history"
          amount={history.length}
        />
      </Page>
      <SearchResults className="mt-3" />
      <SearchBar className={clsx(
        'sticky z-app-search bottom-0 shrink-0',
        styles.safeBottom,
      )} />
    </>
  );
}
