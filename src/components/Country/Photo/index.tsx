import { PhotoDataItemShort } from '@/types/photos';
import clsx from 'clsx';
import { Anchor } from '@/components/UI/Anchor';

interface Props {
  className?: string;
  item: PhotoDataItemShort;
}

export function CountryPhoto(props: Props): JSX.Element {
  const { className = '', item: { name, url, user } } = props;

  return (
    <figure className={clsx('relative', className)}>
      <img
        className="block w-full h-full object-cover"
        src={url}
        alt={`Photo of ${name} by ${user}`}
      />
      <figcaption className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4">
        <Anchor
          className="btn btn-blurred block !w-auto px-2 text-xs pointer-events-auto sm:px-4 sm:text-base"
          type="anchor"
          to={`https://unsplash.com/@${user}`}
          target="_blank"
          rel="noopener nofollow"
        >
          <span className="action-wrp">
            <span className="max-w-[50vw] truncate">@{user}</span>
          </span>
        </Anchor>
      </figcaption>
    </figure>
  );
}
