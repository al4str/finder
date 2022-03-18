import { Coordinates } from '@/types/coordinates';

export interface CountryDataItem {
  name: CountryNames;
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  cioc: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  currencies: {
    [currency: string]: {
      name: string;
      symbol: string;
    };
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  capital: string[];
  altSpellings: string[];
  region: string;
  subregion: string;
  languages: {
    [languageCode: string]: string;
  };
  translations: {
    [languageCode: string]: Omit<CountryNames, 'nativeName'>;
  };
  latlng: Coordinates;
  demonyms: {
    [languageCode: string]: {
      f: string;
      m: string;
    };
  };
  landlocked: boolean;
  area: number;
  flag: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
  gini: {
    [year: string]: number;
  };
  fifa: string;
  car: {
    signs: string[];
    side: string;
  };
  timezones: string[];
  continents: string[];
  flags: {
    svg: string;
    png: string;
  };
  coatOfArms: {
    svg: string;
    png: string;
  };
  startOfWeek: string;
  capitalInfo: {
    latlng: Coordinates;
  };
  postalCode: {
    format: string;
    regex: string;
  };
}

export type CountryCode = CountryDataItem['cca2'];

export type CountryDataItemShort = Pick<CountryDataItem, 'name' | 'cca2' | 'flags'>;

export interface CountryNames {
  common: string;
  official: string;
  nativeName: {
    [languageCode: string]: CountryNames;
  };
}
