import {
  BrowserHistory,
  Location,
  Update,
  To,
  createBrowserHistory,
} from 'history';
import { storeCreate } from '@/utils/store';
import { scrollToY } from '@/utils/scroll';

window.history.scrollRestoration = 'manual';

const HISTORY: BrowserHistory = createBrowserHistory();

HISTORY.listen(onChange);

type Action = 'SET_LOCATIONS' | 'SET_SCROLL';

interface State {
  locations: Array<Location>;
  scrollMap: Map<string, number>;
}

const initialState: State = {
  locations: [HISTORY.location],
  scrollMap: new Map(),
};

const {
  getState,
  dispatch,
} = storeCreate<State, Action>(initialState, reducer);

export function navigationGetHistory(): BrowserHistory {
  return HISTORY;
}

export function navigationGoBack(): void {
  HISTORY.back();
}

type Updater = (currentLocation: Location) => To;

export function navigationGoTo(to: To | Updater): void {
  HISTORY.push(typeof to === 'function' ? to(HISTORY.location) : to);
}

export function navigationUpdateTo(to: To | Updater): void {
  HISTORY.replace(typeof to === 'function' ? to(HISTORY.location) : to);
}

export function navigationMount(): void {
  const { scrollMap } = getState();
  const elId = window.location.hash.replace('#', '');
  const el = window.document.getElementById(elId);
  if (el instanceof HTMLElement) {
    el.scrollIntoView();
    return;
  }
  const { locations } = getState();
  const location = locations[locations.length - 1] || { key: '' };
  const currentKey = location.key;
  if (scrollMap.has(currentKey)) {
    defferScrollY(scrollMap.get(currentKey));
    return;
  }
  defferScrollY();
}

function onChange(update: Update): void {
  const { location } = update;
  const { locations } = getState();
  const { key: currentKey } = locations[locations.length - 1] || { key: '' };
  updateScrollMap(currentKey, window.scrollY);
  updateLocations(location);
}

function updateLocations(next: Location): void {
  const { locations: prevLocations } = getState();
  dispatch('SET_LOCATIONS', {
    locations: prevLocations.concat([next]),
  });
}

function updateScrollMap(location: string, scroll: number): void {
  const { scrollMap: prevScrollMap } = getState();
  const nextScrollMap = new Map(prevScrollMap);
  nextScrollMap.set(location, scroll);
  dispatch('SET_SCROLL', {
    scrollMap: nextScrollMap,
  });
}

function defferScrollY(scroll = 0): void {
  setTimeout(() => scrollToY(scroll), 1000 / 60);
}

function reducer(
  state: State,
  action: {
    type: Action;
    payload: State;
  },
): State {
  switch (action.type) {
    case 'SET_LOCATIONS':
      return {
        ...state,
        locations: action.payload.locations,
      };
    case 'SET_SCROLL':
      return {
        ...state,
        scrollMap: action.payload.scrollMap,
      };
    default:
      return state;
  }
}
