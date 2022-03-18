import { ReactNode, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { mapSetPosition, mapCalculateZoom } from '@/helpers/map';
import { useSearchStore } from '@/helpers/search';
import { countryInit, countryGetDescription, useCountryStore } from '@/helpers/country';
import { photosFetch, usePhotosStore } from '@/helpers/photos';
import { Page } from '@/components/Page';
import { Anchor } from '@/components/UI/Anchor';
import { CountryNotFound } from '@/components/Country/NotFound';
import { CountryDetails } from '@/components/Country/Details';
import { FavoritesAction } from '@/components/Favorites/Action';
import { CountryPhotos } from '@/components/Country/Photos';
import { shuffle } from '@/utils/shuffle';

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
  const { photos } = usePhotosStore();
  const item = items.get(code);
  const name = item?.name?.common || '';
  const flag = item?.flags?.svg || item?.flags?.png || '';
  const hasFlag = pending || Boolean(flag);

  const details = useMemo<DetailDataItem[]>(() => {
    return [
      {
        name: 'name.official',
        value: item?.name?.official,
      },
      {
        name: 'name.nativeName',
        value: (
          <>
            {Object
              .values(item?.name?.nativeName || {})
              .map((nativeNames) => (
                <p key={nativeNames.official}>
                  {nativeNames.official}
                </p>
              ))
            }
          </>
        ),
      },
      {
        name: 'flag',
        value: item?.flag,
      },
      {
        name: 'coatOfArms',
        value: item?.coatOfArms?.png && (
          <img
            className="block mt-3 max-w-[200px]"
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
                  {currency.name}
                  {Boolean(currency.symbol) && (
                    <span>&nbsp;({currency.symbol})</span>
                  )}
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
            <p>
              <span className="text-gray-600 dark:text-zinc-500">
                Signs:&nbsp;
              </span>
              {item?.car?.signs?.join(', ')}
            </p>
            <p>
              <span className="text-gray-600 dark:text-zinc-500">
                Side:&nbsp;
              </span>
              {item?.car?.side}
            </p>
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
                    <span className="text-gray-600 dark:text-zinc-500">
                      {lang}:&nbsp;
                    </span>
                    {demonyms.m} (m), {demonyms.f} (f)
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
                <p key={lang} className="mb-0.5 last:mb-0">
                  <span className="text-gray-600 dark:text-zinc-500">
                    {lang}:&nbsp;
                  </span>
                  {names.official}
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
  const countryPhotos = useMemo(() => {
    return shuffle(photos.get(name) || []);
  }, [photos, name]);

  useEffect(() => {
    if (code) {
      void countryInit(code);
    }
  }, [code]);
  useEffect(() => {
    if (name) {
      void photosFetch(name);
    }
  }, [name]);
  useEffect(() => {
    if (ready && item) {
      mapSetPosition(item.cca2, {
        coordinates: item.latlng,
        zoom: mapCalculateZoom(item.area),
      });
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
    <Page className="mx-3 rounded-lg sm:rounded-2xl sm:mx-5">
      <div className="relative h-[250px] background-gradient bg-fixed rounded-t-lg xs:h-[300px] sm:h-[400px] md:h-[500px] sm:rounded-t-2xl">
        <CountryPhotos className="w-full h-full rounded-t-lg overflow-hidden sm:rounded-t-2xl" items={countryPhotos} />
        <FavoritesAction
          className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4"
          action
          code={code}
        />
      </div>
      <div className="p-2 background rounded-b-lg sm:px-5 sm:pt-3 sm:pb-7 sm:rounded-b-2xl">
        <div className="flex">
          <h1 className={clsx('heading text-3xl mr-2 sm:text-5xl sm:mr-4 sm:mt-1', pending && 'skeleton')}>
            {pending ? 'Pending' : name}
          </h1>
          {hasFlag && (
            <span
              className={clsx(
                'w-8 h-8 shrink-0 ml-auto bg-center bg-no-repeat bg-contain sm:w-16 sm:h-16',
                pending && 'skeleton',
              )}
              style={{
                backgroundImage: `url(${flag})`,
              }}
            />
          )}
        </div>
        <dl className="mt-3 sm:mt-5">
          {details.map((detail) => (
            <CountryDetails
              key={detail.name}
              className="mb-3 mb-5 last:mb-0"
              pending={pending}
              label={countryGetDescription(detail.name)}
            >
              {detail.value}
            </CountryDetails>
          ))}
        </dl>
      </div>
    </Page>
  );
}
