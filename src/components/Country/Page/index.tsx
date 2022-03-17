import { ReactNode, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { mapSetPosition } from '@/helpers/map';
import { useSearchStore } from '@/helpers/search';
import { countryInit, useCountryStore, countryGetDescription } from '@/helpers/country';
import { Page } from '@/components/Page';
import { Anchor } from '@/components/UI/Anchor';
import { CountryNotFound } from '@/components/Country/NotFound';
import { CountryDetails } from '@/components/Country/Details';
import { FavoritesAction } from '@/components/Favorites/Action';

interface DetailDataItem {
  name: string;
  value: ReactNode;
}

export function CountryPage(): JSX.Element {
  const params = useParams();
  const rawCode = params.code || '';
  const code = rawCode.toUpperCase();
  const { items } = useSearchStore();
  const { pending, ready, notFound } = useCountryStore();
  const item = items.get(code);
  const name = item?.name?.official;
  const flag = item?.flags?.svg || item?.flags?.png || '';
  const hasFlag = pending || Boolean(flag);

  const details = useMemo<DetailDataItem[]>(() => {
    return [
      {
        name: 'name.common',
        value: item?.name?.common,
      },
      {
        name: 'name.nativeName',
        value: Object
          .entries(item?.name?.nativeName || {})
          .map(([lang, nativeNames]) => {
            return `${nativeNames.official} (${lang})`;
          })
          .join(', '),
      },
      {
        name: 'flag',
        value: item?.flag,
      },
      {
        name: 'coatOfArms',
        value: item?.coatOfArms?.png && (
          <img
            className="block mt-3 mx-auto max-w-[200px]"
            src={item?.coatOfArms?.png}
            alt={`${item?.name?.official} coat of arms`}
          />
        ),
      },
      {
        name: 'independent',
        value: item?.independent ? 'Yes' : 'No',
      },
      {
        name: 'currencies',
        value: (
          <>
            {Object
              .values(item?.currencies || {})
              .map((currency) => (
                <p key={currency.name}>
                  {currency.name} ({currency.symbol})
                </p>
              ))
            }
          </>
        ),
      },
      {
        name: 'languages',
        value: Object
          .values(item?.languages || {})
          .join(', '),
      },
      {
        name: 'population',
        value: item?.population.toLocaleString(),
      },
      {
        name: 'area',
        value: item?.area.toLocaleString(),
      },
      {
        name: 'landlocked',
        value: item?.landlocked ? 'Yes' : 'No',
      },
      {
        name: 'capital',
        value: item?.capital?.join(', '),
      },
      {
        name: 'region',
        value: item?.region,
      },
      {
        name: 'subregion',
        value: item?.subregion,
      },
      {
        name: 'continents',
        value: item?.continents?.join(', '),
      },
      {
        name: 'timezones',
        value: item?.timezones?.join(', '),
      },
      {
        name: 'startOfWeek',
        value: (
          <p className="capitalize">{item?.startOfWeek}</p>
        ),
      },
      {
        name: 'status',
        value: (
          <p className="capitalize">
            {item?.status.replace(/-/, ' ')}
          </p>
        ),
      },
      {
        name: 'unMember',
        value: item?.unMember ? 'Yes' : 'No',
      },
      {
        name: 'car',
        value: (
          <>
            <p>Signs: {item?.car?.signs?.join(', ')}</p>
            <p>Side: {item?.car?.side}</p>
          </>
        ),
      },
      {
        name: 'altSpellings',
        value: item?.altSpellings?.join(', '),
      },
      {
        name: 'demonyms',
        value: (
          <>
            {Object
              .entries(item?.demonyms || {})
              .map(([lang, demonyms]) => {
                return (
                  <p key={lang}>
                    Male: {demonyms.m}, Female {demonyms.f} ({lang})
                  </p>
                );
              })
            }
          </>
        ),
      },
      {
        name: 'gini',
        value: Object
          .entries(item?.gini || {})
          .map(([year, score]) => {
            return `${score} (${year})`;
          })
          .join(', '),
      },
      {
        name: 'idd',
        value: item?.idd?.root,
      },
      {
        name: 'fifa',
        value: item?.fifa,
      },
      {
        name: 'cca2',
        value: item?.cca2,
      },
      {
        name: 'ccn3',
        value: item?.ccn3,
      },
      {
        name: 'cca3',
        value: item?.cca3,
      },
      {
        name: 'cioc',
        value: item?.cioc,
      },
      {
        name: 'tld',
        value: item?.tld?.join(', '),
      },
      {
        name: 'translations',
        value: (
          <>
            {Object
              .entries(item?.translations || {})
              .map(([lang, names]) => (
                <p key={lang}>
                  {names.official} ({lang})
                </p>
              ))
            }
          </>
        ),
      },
      {
        name: 'latlng',
        value: (
          <pre>
            [{item?.latlng?.join(', ')}]
          </pre>
        ),
      },
      {
        name: 'maps',
        value: (
          <>
            <div>
              <Anchor
                className="underline"
                type="anchor"
                to={item?.maps?.googleMaps || ''}
                target="_blank"
                rel="noopener nofollow"
              >
                Google Maps
              </Anchor>
            </div>
            <div className="mt-1">
              <Anchor
                className="underline"
                type="anchor"
                to={item?.maps?.openStreetMaps || ''}
                target="_blank"
                rel="noopener nofollow"
              >
                OpenStreetMaps
              </Anchor>
            </div>
          </>
        ),
      },
    ].filter((detail) => Boolean(detail.value));
  }, [item]);

  useEffect(() => {
    if (code) {
      void countryInit(code);
    }
  }, [code]);
  useEffect(() => {
    if (ready && item) {
      const ratio = Math.ceil((28 * item.area) / 17000000);
      const zoom = Math.min(Math.max(2, 28 - ratio), 14);
      mapSetPosition(() => ({
        coordinates: item.latlng,
        zoom,
      }));
    }
  }, [ready, item]);

  if (!code || notFound) {
    return (
      <Page className="mx-3 p-2 rounded-lg background">
        <CountryNotFound />
      </Page>
    );
  }
  return (
    <Page className="mx-3 p-2 rounded-lg background">
      <div className="flex items-center">
        <span className="ml-auto mr-0.5 text-gray-600">To favorites</span>
        <FavoritesAction action code={code} />
      </div>
      <div className="flex mt-3">
        <h1 className={clsx('text-2xl font-serif mr-2', pending && 'skeleton')}>
          {pending ? 'Pending' : name}
        </h1>
        {hasFlag && (
          <span
            className={clsx(
              'w-8 h-8 p-1 shrink-0 ml-auto bg-center bg-no-repeat',
              pending && 'skeleton',
            )}
            style={{
              backgroundImage: `url(${flag})`,
            }}
          />
        )}
      </div>
      <dl className="mt-3">
        {details.map((detail) => (
          <CountryDetails
            key={detail.name}
            className="mb-3 last:mb-0"
            pending={pending}
            label={countryGetDescription(detail.name)}
          >
            {detail.value}
          </CountryDetails>
        ))}
      </dl>
    </Page>
  );
}
