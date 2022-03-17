import { CountryDataItemShort } from '@/types/countries';
import clsx from 'clsx';
import { ListItem } from '@/components/List/Item';

interface Props {
  className?: string;
  items: CountryDataItemShort[];
}

export function ListItems(props: Props): JSX.Element {
  const { className = '', items } = props;
  return (
    <ul className={clsx(className)}>
      {items.map((item) => (
        <li key={item.cca2} className="mb-3 last:mb-0">
          <ListItem item={item} />
        </li>
      ))}
    </ul>
  );
}
