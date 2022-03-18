import { CountryCode } from '@/types/countries';
import { Coordinates, CoordinatesDataItem } from '@/types/coordinates';
import { storeCreate } from '@/utils/store';
import { assetsGetURL } from '@/utils/assets';
import { fetchExec } from '@/utils/fetch';

export interface MapPosition {
  /* Lat/Lng */
  coordinates: Coordinates;
  zoom: number;
}

type Action = 'SET_POSITION' | 'SET_MAP';

interface State {
  coordinates: MapPosition['coordinates'];
  zoom: MapPosition['zoom'];
  byCode: Map<CountryCode, Coordinates>;
}

const initialState: State = {
  coordinates: [75, -20],
  zoom: 2,
  byCode: new Map(),
};

const {
  getState,
  dispatch,
  useStore,
} = storeCreate<State, Action>(
  initialState,
  reducer,
);

export const mapGetState = getState;

export function useMapStore() {
  useStore();

  return getState();
}

export async function mapInit() {
  await mapFetchCoordinates();
}

export function mapSetPosition(code: string, position: MapPosition): void {
  const { byCode } = getState();
  const coordinates = byCode.get(code);
  dispatch('SET_POSITION', {
    coordinates: coordinates || position.coordinates,
    zoom: position.zoom,
  });
}

export function mapCalculateZoom(area: number): number {
  if (area < 10) {
    return 14;
  }
  if (area < 50) {
    return 13;
  }
  if (area < 100) {
    return 12;
  }
  if (area < 250) {
    return 11;
  }
  if (area < 750) {
    return 10;
  }
  if (area < 1_000) {
    return 9;
  }
  if (area < 10_000) {
    return 8;
  }
  if (area < 100_000) {
    return 7;
  }
  if (area < 1_250_000) {
    return 6;
  }
  if (area < 1_500_000) {
    return 5;
  }
  if (area < 1_000_000) {
    return 4;
  }
  return 3;
}

export async function mapFetchCoordinates() {
  const url = assetsGetURL('geo/countries.json');
  const res = await fetchExec<CoordinatesDataItem[]>({ url });
  const byCode = new Map();
  if (res.ok) {
    res.body.forEach((item) => {
      byCode.set(item.code, [+item.lat, +item.lon]);
    });
    dispatch('SET_MAP', {
      byCode,
    });
  }
}

function reducer(
  state: State,
  action: { type: Action; payload: State },
): State {
  switch (action.type) {
    case 'SET_POSITION':
      return {
        ...state,
        coordinates: action.payload.coordinates,
        zoom: action.payload.zoom,
      };
    case 'SET_MAP':
      return {
        ...state,
        byCode: action.payload.byCode,
      };
    default:
      return state;
  }
}
