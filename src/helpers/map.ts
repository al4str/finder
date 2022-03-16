import { storeCreate } from '@/utils/store';

export type MapCoordinates = [number, number];

export interface MapPosition {
  coordinates: MapCoordinates;
  zoom: number;
}

type Action = 'SET_POSITION';

interface State {
  coordinates: MapPosition['coordinates'];
  zoom: MapPosition['zoom'];
}

const initialState: State = {
  coordinates: [-0.12755, 51.507222],
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

export function useMapStore() {
  useStore();

  return getState();
}

export function mapSetPosition(position: MapPosition): void {
  dispatch('SET_POSITION', {
    coordinates: position.coordinates,
    zoom: position.zoom,
  });
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
