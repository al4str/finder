import { useCallback } from 'react';
import clsx from 'clsx';
import { CountryDataItemShort } from '@/types/countries';
import { ROUTES, routesReplace } from '@/helpers/routes';
import { useHistory } from '@/helpers/history';
import { Anchor } from '@/components/UI/Anchor';
import { FavoritesAction } from '@/components/Favorites/Action';

interface Props {
  className?: string;
  item: CountryDataItemShort;
}

export function ListItem(props: Props): JSX.Element {
  const { className = '', item } = props;
  const code = item.cca2;
  const link = routesReplace(ROUTES.country, {
    code: code.toLowerCase(),
  });
  const name = item.name.official;
  const nativeCollection = item.name?.nativeName || {};
  const altNames = [
    item.name.common,
    ...Array
      .from(Object.values(nativeCollection))
      .reduce((result, native) => {
        const nativeName = native.official || '';
        if (result.includes(nativeName)) {
          return result;
        }
        return result.concat([nativeName]);
      }, [] as string[]),
  ].filter(Boolean).join(', ');
  const flag = item.flags.svg || item.flags.png || '';
  const hasFlag = Boolean(flag);
  const [, setHistory] = useHistory();

  const handleHistory = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.includes(code)) {
        return prevHistory;
      }
      return prevHistory.concat([code]);
    });
  }, [code, setHistory]);

  return (
    <Anchor
      className={clsx('block p-2 rounded-lg bg-gray-200 hover:bg-white dark:bg-zinc-800 dark:hover:bg-zinc-700 sm:p-3 sm:rounded-2xl transition-colors', className)}
      type="link"
      to={link}
      onClick={handleHistory}
    >
      <span className="flex items-center">
        <span className="min-w-0 mr-2 sm:mr-3">
          <span className="heading text-lg sm:text-2xl">{name}</span>
          <span className="flex items-center">
            <FavoritesAction
              className="shrink-0 mr-0.5 sm:mr-1.5"
              action={false}
              code={code}
            />
            <span className="block text-sm text-gray-600 truncate dark:text-zinc-400 sm:text-base">
              {altNames}
            </span>
          </span>
        </span>
        {hasFlag && (
          <span
            className="w-8 h-8 shrink-0 ml-auto bg-center bg-no-repeat bg-contain sm:w-12 sm:h-12"
            style={{
              backgroundImage: `url(${flag})`,
            }}
          />
        )}
      </span>
    </Anchor>
  );
}
