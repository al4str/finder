import { useCallback } from 'react';
import clsx from 'clsx';
import { useFavorites } from '@/helpers/favorites';
import Star from '@/components/Icons/star.svg';

interface Props {
  className?: string;
  action: boolean;
  code: string;
}

export function FavoritesAction(props: Props): JSX.Element {
  const { className = '', action, code } = props;
  const [favorites, setFavorites] = useFavorites();
  const disabled = !code;
  const filled = favorites.includes(code);

  const handleToggle = useCallback(() => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(code)) {
        return prevFavorites.filter((item) => item !== code);
      }
      return prevFavorites.concat([code]);
    });
  }, [code, setFavorites]);

  if (action) {
    return (
      <button
        className={clsx(
          'btn btn-flat block w-8 h-8 rounded-md',
          className,
        )}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
      >
        <span className="btn-wrp">
          <Star
            className={clsx(
              'block w-6 h-6',
              filled
                ? 'fill-current text-yellow-400'
                : 'fill-transparent stroke-current text-gray-400',
            )}
          />
        </span>
      </button>
    );
  }
  return (
    <Star
      className={clsx(
        'block w-4 h-4',
        filled
          ? 'fill-current text-yellow-600'
          : 'fill-transparent stroke-current text-gray-600',
        className,
      )}
    />
  );
}
