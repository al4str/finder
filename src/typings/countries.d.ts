export interface CountryDataItem {
  name: CountryName;
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  cioc: string;
  independent: boolean;
  status: string;
  currencies: {
    [currencyCode: string]: CountryCurrency;
  };
  idd: CountryIddCode;
  capital: string[];
  altSpellings: string[];
  region: string;
  subregion: string;
  languages: {
    [languageCode: string]: string;
  };
  translations: {
    [languageCode: string]: CountryOfficialAndCommon;
  };
  latlng: [number, number];
  demonyms: {
    [languageCode: string]: CountryDemonyms;
  };
  landlocked: boolean;
  borders: string[];
  area: number;
  flag: string;
}

export type CountryCode = CountryDataItem['cca2'];

export type CountryDataItemShort = Pick<CountryDataItem, 'name' | 'cca2' | 'flag'>;

export interface CountryName extends CountryOfficialAndCommon {
  native: {
    [languageCode: string]: CountryOfficialAndCommon;
  };
}

export interface CountryOfficialAndCommon {
  common: string;
  official: string;
}

export interface CountryCurrency {
  name: string;
  symbol: string;
}

export interface CountryIddCode {
  root: string;
  suffixes: string[];
}

export interface CountryDemonyms {
  f: string;
  m: string;
}
