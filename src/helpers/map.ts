import { Coordinate } from 'ol/coordinate';
import { storeCreate } from '@/utils/store';

export type MapCoordinates = Coordinate;

export interface MapPosition {
  /* Lat/Lng */
  coordinates: MapCoordinates;
  zoom: number;
}

type Action = 'SET_POSITION';

interface State {
  coordinates: MapPosition['coordinates'];
  zoom: MapPosition['zoom'];
}

const initialState: State = {
  coordinates: [51.507222, -0.12755],
  zoom: 7,
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

export function mapSetPosition(updater: (prev: MapPosition) => MapPosition): void {
  dispatch('SET_POSITION', updater(getState()));
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
    default:
      return state;
  }
}
