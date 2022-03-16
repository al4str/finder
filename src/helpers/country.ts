import { CountryDataItem, CountryCode } from '@/typings/countries';
import { API_URL } from '@/constants';
import { storeCreate } from '@/utils/store';
import { fetchExec } from '@/utils/fetch';
import { searchGetState, searchAddItem } from '@/helpers/search';

type Action = 'SET_READY_STATE' | 'SET_CODE';

type ReadyState = 'INITIAL' | 'FETCHING' | 'READY' | 'NOT_FOUND';

interface State {
  readySate: ReadyState;
  pending: boolean;
  ready: boolean;
  notFound: boolean;
  code: CountryCode;
}

const initialState: State = {
  readySate: 'INITIAL',
  pending: true,
  ready: false,
  notFound: false,
  code: '',
};

const {
  dispatch,
  useStore,
} = storeCreate<State, Action>(
  initialState,
  reducer,
);

export const useCountryStore = useStore;

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
  const res = await fetchExec<CountryDataItem>({
    url: `${API_URL}/alpha/${code}`,
  });
  if (res.ok) {
    searchAddItem(res.body);
  }
  dispatch('SET_READY_STATE', {
    readySate: 'READY',
  });
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
