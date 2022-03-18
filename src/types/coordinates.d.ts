import { Coordinate } from 'ol/coordinate';

/**
 * [Latitude, Longitude]
 * */
export type Coordinates = Coordinate;

export interface CoordinatesDataItem {
  code: string;
  lat: string;
  lon: string;
}
