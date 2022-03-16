import { ReactNode, Suspense } from 'react';
import { Anchor } from '@/components/UI/Anchor';
import { ROUTES } from '@/helpers/routes';

const LINKS = [
  {
    to: ROUTES.main,
    label: 'Main',
  },
  {
    to: ROUTES.history,
    label: 'History',
  },
  {
    to: ROUTES.favorites,
    label: 'Favorites',
  },
  {
    to: ROUTES.search,
    label: 'Search',
  },
  {
    to: ROUTES.country,
    label: 'Country',
  },
];

interface Props {
  children: ReactNode;
}

export function LayoutsDefault(props: Props): JSX.Element {
  const { children } = props;

  return (
    <>
      <div>
        <nav>
          <ul>
            {LINKS.map((link) => (
              <li key={link.to} className="mr-2">
                <Anchor
                  activeClassName="font-bold"
                  type="nav"
                  to={link.to}
                >
                  {link.label}
                </Anchor>
              </li>
            ))}
          </ul>
        </nav>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </div>
    </>
  );
}
