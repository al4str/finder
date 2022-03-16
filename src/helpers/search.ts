import { CountryDataItem, CountryDataItemShort, CountryCode } from '@/typings/countries';
import { API_URL } from '@/constants';
import { storeCreate } from '@/utils/store';
import { fetchExec } from '@/utils/fetch';

type Action = 'SET_READY_STATE' | 'SET_BY' | 'SET_NAMES'
  | 'SET_ITEMS' | 'SET_QUERY' | 'SET_RESULTS';

type ReadyState = 'INITIAL' | 'FETCHING' | 'READY' | 'SEARCHING';

export type SearchBy = 'name' | 'alpha' | 'currency' | 'lang'
  | 'capital' | 'region' | 'subregion';

interface State {
  readySate: ReadyState;
  pending: boolean;
  ready: boolean;
  searching: boolean;
  found: boolean;
  notFound: boolean;
  by: SearchBy;
  names: Set<CountryDataItemShort>;
  items: Map<CountryCode, CountryDataItem>;
  query: string;
  results: Set<CountryCode>;
}

const initialState: State = {
  readySate: 'INITIAL',
  pending: true,
  ready: false,
  searching: false,
  found: false,
  notFound: false,
  by: 'name',
  query: '',
  names: new Set(),
  items: new Map(),
  results: new Set(),
};

const {
  getState,
  dispatch,
  useStore,
} = storeCreate<State, Action>(
  initialState,
  reducer,
);

export const searchGetState = getState;

export const useSearchStore = useStore;

export async function searchInit() {
  dispatch('SET_READY_STATE', {
    readySate: 'FETCHING',
  });
  const res = await fetchExec<CountryDataItemShort[]>({
    url: `${API_URL}/all/?fields=name,cca2,flags`,
  });
  if (res.ok) {
    const nextNames = new Set<CountryDataItemShort>();
    res.body.forEach((item) => {
      nextNames.add(item);
    });
    dispatch('SET_NAMES', {
      names: nextNames,
    });
  }
  dispatch('SET_READY_STATE', {
    readySate: 'READY',
  });
}

export async function searchExec(query: string) {
  dispatch('SET_READY_STATE', {
    readySate: 'SEARCHING',
  });
  dispatch('SET_QUERY', {
    query,
  });
  const { by } = searchGetState();
  const res = await fetchExec<CountryDataItem[]>({
    url: `${API_URL}/${by}/${query}`,
  });
  if (res.ok) {
    const { items } = searchGetState();
    const nextItems = new Map(items);
    const nextResults = new Set<CountryCode>();
    res.body.forEach((item) => {
      nextItems.set(item.cca2, item);
      nextResults.add(item.cca2);
    });
    dispatch('SET_ITEMS', {
      items: nextItems,
    });
    dispatch('SET_RESULTS', {
      results: nextResults,
    });
  }
  dispatch('SET_READY_STATE', {
    readySate: 'READY',
  });
}

export function searchSetBy(by: SearchBy) {
  const { query } = searchGetState();
  dispatch('SET_BY', {
    by,
  });
  if (query) {
    void searchExec(query);
  }
}

export function searchAddItem(item: CountryDataItem) {
  if (item) {
    const { items } = searchGetState();
    const nextItems = new Map(items);
    nextItems.set(item.cca2, item);
    dispatch('SET_ITEMS', {
      items: nextItems,
    });
  }
}

function reducer(
  state: State,
  action: { type: Action; payload: State },
): State {
  switch (action.type) {
    case 'SET_READY_STATE': {
      const nextReadyState = action.payload.readySate;
      const ready = nextReadyState === 'READY';
      const hasQuery = Boolean(state.query);
      const resultsLength = state.results.size;

      return {
        ...state,
        readySate: nextReadyState,
        pending: ['INITIAL', 'FETCHING'].includes(nextReadyState),
        ready: nextReadyState === 'READY',
        searching: nextReadyState === 'SEARCHING',
        found: ready && hasQuery && resultsLength > 0,
        notFound: ready && hasQuery && resultsLength === 0,
      };
    }
    case 'SET_BY':
      return {
        ...state,
        by: action.payload.by,
      };
    case 'SET_NAMES':
      return {
        ...state,
        names: action.payload.names,
      };
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload.items,
      };
    case 'SET_QUERY':
      return {
        ...state,
        query: action.payload.query,
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload.results,
      };
    default:
      return state;
  }
}
