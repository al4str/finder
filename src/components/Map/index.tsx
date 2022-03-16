import 'ol/ol.css';
import OpenLayerMap from 'ol/Map';
import OpenLayerTileLayer from 'ol/layer/Tile';
import OpenLayerView from 'ol/View';
import OpenLayerXYZ from 'ol/source/XYZ';
import { fromLonLat, transform } from 'ol/proj';
import { memo, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { KEY_MAPTILER } from '@/constants';
import { MapCoordinates, useMapStore } from '@/helpers/map';

interface Props {
  className?: string;
}

export const Map = memo((props: Props): JSX.Element => {
  const { className = '' } = props;
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<null | OpenLayerMap>(null);
  const { coordinates, zoom } = useMapStore();

  useEffect(() => {
    const map = mapRef.current;
    if (map instanceof OpenLayerMap) {
      map.getView().animate({
        center: fromLonLat(coordinates),
        zoom,
        duration: 2000,
      });
    }
  }, [coordinates, zoom]);
  useEffect(() => {
    const el = elRef.current;
    const map = mapRef.current;
    if (el instanceof HTMLDivElement && map === null) {
      mapRef.current = render(el, coordinates, zoom);
    }
  }, [coordinates, zoom]);

  return (
    <div className={clsx('relative pointer-events-none', className)}>
      <div className="absolute top-0 left-0 w-full h-full" ref={elRef} />
    </div>
  );
});

const URL = 'https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}@2x.jpg';

function render(
  el: HTMLDivElement,
  coordinates: MapCoordinates,
  zoom: number,
): OpenLayerMap {
  return new OpenLayerMap({
    target: el,
    layers: [
      new OpenLayerTileLayer({
        source: new OpenLayerXYZ({
          url: `${URL}?key=${KEY_MAPTILER}`,
          tilePixelRatio: 2,
          attributions: '',
        }),
      }),
    ],
    view: new OpenLayerView({
      projection: 'EPSG:3857',
      center: transform(coordinates, 'EPSG:4326', 'EPSG:3857'),
      zoom,
    }),
    controls: [],
    interactions: [],
  });
}
