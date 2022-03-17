import { CountryDataItem, CountryCode } from '@/types/countries';
import { API_URL } from '@/constants';
import { storeCreate } from '@/utils/store';
import { fetchExec } from '@/utils/fetch';
import { searchGetState, searchAddItem } from '@/helpers/search';

type Action = 'SET_READY_STATE' | 'SET_CODE';

type ReadyState = 'INITIAL' | 'FETCHING' | 'READY' | 'NOT_FOUND';

interface State {
  readySate: ReadyState;
  initial: boolean;
  pending: boolean;
  ready: boolean;
  notFound: boolean;
  code: CountryCode;
}

const initialState: State = {
  readySate: 'INITIAL',
  initial: true,
  pending: true,
  ready: false,
  notFound: false,
  code: '',
};

const {
  getState,
  dispatch,
  useStore,
} = storeCreate<State, Action>(
  initialState,
  reducer,
);

export function useCountryStore() {
  useStore();

  return getState();
}

export async function countryInit(code: CountryCode) {
  if (!code) {
    dispatch('SET_READY_STATE', {
      readySate: 'NOT_FOUND',
    });
    return;
  }
  const { items } = searchGetState();
  const item = items.get(code);
  if (item) {
    dispatch('SET_READY_STATE', {
      readySate: 'READY',
    });
    return;
  }
  dispatch('SET_READY_STATE', {
    readySate: 'FETCHING',
  });
  const res = await fetchExec<CountryDataItem[]>({
    url: `${API_URL}/alpha/${code}`,
  });
  if (res.ok && res.body[0]) {
    searchAddItem(res.body[0]);
  }
  dispatch('SET_READY_STATE', {
    readySate: 'READY',
  });
}

export function countryGetDescription(name: string): string {
  switch (name) {
    case 'name.common':
      return 'Common name';
    case 'name.official':
      return 'Official name';
    case 'name.nativeName':
      return 'Native name';
    case 'tld':
      return 'Top-level domains';
    case 'cca2':
      return 'ISO 3166-1 alpha-2 code';
    case 'ccn3':
      return 'ISO 3166-1 numeric code';
    case 'cca3':
      return 'ISO 3166-1 alpha-3code';
    case 'cioc':
      return 'International Olympic Committee code';
    case 'independent':
      return ' Independence status';
    case 'status':
      return 'Assignment status';
    case 'unMember':
      return 'UN Member status';
    case 'currencies':
      return 'Currencies';
    case 'idd':
      return 'International Direct Dialing';
    case 'capital':
      return 'Capital cities';
    case 'altSpellings':
      return 'Alternative spellings';
    case 'region':
      return 'Region';
    case 'subregion':
      return 'Subregion';
    case 'languages':
      return 'List of official languages';
    case 'translations':
      return 'List of name translations';
    case 'latlng':
      return 'Latitude and longitude';
    case 'demonyms':
      return 'Name of residents';
    case 'landlocked':
      return 'Landlocked status';
    case 'area':
      return 'Land area, km²';
    case 'flag':
      return 'Emoji flag';
    case 'maps':
      return 'Map links';
    case 'population':
      return 'Population';
    case 'gini':
      return 'Gini ratio, a measure of statistical dispersion';
    case 'fifa':
      return 'FIFA, three-letter country code';
    case 'car':
      return 'Car signs and driving side';
    case 'timezones':
      return 'Timezones';
    case 'continents':
      return 'Continents';
    case 'coatOfArms':
      return 'A coat of arms, a heraldic visual design';
    case 'startOfWeek':
      return 'Start of the week';
    default:
      return '';
  }
}

function reducer(
  state: State,
  action: { type: Action; payload: State },
): State {
  switch (action.type) {
    case 'SET_READY_STATE': {
      const nextReadyState = action.payload.readySate;

      return {
        ...state,
        readySate: nextReadyState,
        initial: nextReadyState === 'INITIAL',
        pending: ['INITIAL', 'FETCHING'].includes(nextReadyState),
        ready: nextReadyState === 'READY',
        notFound: nextReadyState === 'NOT_FOUND',
      };
    }
    case 'SET_CODE':
      return {
        ...state,
        code: action.payload.code,
      };
    default:
      return state;
  }
}
