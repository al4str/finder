import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '@/components/Page';
import { useCountryStore, countryInit } from '@/helpers/country';
import { useSearchStore } from '@/helpers/search';
import { mapSetPosition } from '@/helpers/map';

export function CountryPage(): JSX.Element {
  const params = useParams();
  const rawCode = params.code || '';
  const code = rawCode.toUpperCase();
  const { items } = useSearchStore();
  const { ready, notFound } = useCountryStore();
  const item = items.get(code);

  useEffect(() => {
    if (code) {
      void countryInit(code);
    }
  }, [code]);
  useEffect(() => {
    if (ready && item) {
      const [lat, lng] = item.latlng;
      mapSetPosition({
        coordinates: [lng, lat],
        zoom: 7,
      });
    }
  }, [ready, item]);

  return (
    <Page className="background">
      {notFound && <p>Not found</p>}
      {ready && <pre className="block overflow-x-hidden">{JSON.stringify(item, null, 2)}</pre>}
    </Page>
  );
}
