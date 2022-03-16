import { useRef } from 'react';
import { ROUTES, routesReplace } from '@/helpers/routes';
import { useFavorites } from '@/helpers/favorites';
import { useHistory } from '@/helpers/history';
import { Page } from '@/components/Page';
import { MainLink } from '@/components/Main/Link';
import { useSearchStore } from '@/helpers/search';
import { randomNumber } from '@/utils/random';

export function MainPage(): JSX.Element {
  const [favorites] = useFavorites();
  const [history] = useHistory();
  const { names } = useSearchStore();
  const randomIndexRef = useRef(randomNumber(0, names.size));
  const item = Array.from(names)[randomIndexRef.current];
  const hasItem = Boolean(item);
  const luckyCode = (item?.cca2 || '').toLowerCase();
  const luckyLink = routesReplace(ROUTES.country, { code: luckyCode });

  return (
    <Page>
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
  );
}
