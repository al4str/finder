import clsx from 'clsx';
import { SearchField } from '@/components/Search/Field';

interface Props {
  className?: string;
}

export function SearchBar(props: Props): JSX.Element {
  const { className = '' } = props;

  return (
    <div
      className={clsx(className)}
      id="search"
    >
      <div className="mt-3 mx-3 p-2 rounded-lg background-blurred">
        <SearchField />
      </div>
    </div>
  );
}
