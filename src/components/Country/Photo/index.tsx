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
      <figcaption className="absolute right-2 bottom-2">
        <Anchor
          className="action block h-8 px-2 text-sm rounded-2xl background-blurred pointer-events-auto"
          type="anchor"
          to={`https://unsplash.com/@${user}`}
          target="_blank"
          rel="noopener nofollow"
        >
          <span className="action-wrp">
            <span>@{user}</span>
          </span>
        </Anchor>
      </figcaption>
    </figure>
  );
}