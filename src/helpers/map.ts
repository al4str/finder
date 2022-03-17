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
