import 'ol/ol.css';
import OpenLayerMap from 'ol/Map';
import OpenLayerTileLayer from 'ol/layer/Tile';
import OpenLayerView from 'ol/View';
import OpenLayerXYZ from 'ol/source/XYZ';
import { fromLonLat, transform } from 'ol/proj';
import { memo, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { KEY_MAPTILER } from '@/constants';
import { MapCoordinates, mapGetState, useMapStore } from '@/helpers/map';
import { useViewportSize, viewportGetSize } from '@/hooks/viewportSize';

interface Props {
  className?: string;
}

export const Map = memo((props: Props): JSX.Element => {
  const { className = '' } = props;
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<null | OpenLayerMap>(null);
  const sizes = useViewportSize();
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
      mapRef.current = getMap(el);
    }
  }, []);
  useEffect(() => {
    const map = mapRef.current;
    if (map instanceof OpenLayerMap) {
      const position = mapGetState();
      const view = getView(position.coordinates, position.zoom);
      map.setView(view);
    }
  }, [sizes]);

  return (
    <div className={clsx('pointer-events-none', className)}>
      <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
        <span className="block text-gray-600">Preparing map..</span>
      </div>
      <div className="absolute top-0 left-0 w-full h-full" ref={elRef}>
      </div>
    </div>
  );
});

const URL = 'https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}@2x.jpg';

function getMap(
  el: HTMLDivElement,
): OpenLayerMap {
  return new OpenLayerMap({
    target: el,
    layers: [
      new OpenLayerTileLayer({
        source: new OpenLayerXYZ({
          url: `${URL}?key=${KEY_MAPTILER}`,
          tilePixelRatio: 2,
        }),
      }),
    ],
    controls: [],
    interactions: [],
  });
}

function getView(
  coordinates: MapCoordinates,
  zoom: number,
): OpenLayerView {
  return new OpenLayerView({
    projection: 'EPSG:3857',
    center: transform(coordinates, 'EPSG:4326', 'EPSG:3857'),
    zoom,
    padding: getPadding(),
  });
}

const SAFE_MARGIN = 12;

function getPadding(): [number, number, number, number] {
  const { visualHeight } = viewportGetSize();
  const header = window.document.getElementById('header');
  const space = window.document.getElementById('space');
  const headerHeight = header instanceof HTMLElement
    ? header.clientHeight
    : SAFE_MARGIN;
  const spaceHeight = space instanceof HTMLElement
    ? space.clientHeight
    : SAFE_MARGIN;

  return [
    headerHeight,
    SAFE_MARGIN,
    visualHeight - spaceHeight,
    SAFE_MARGIN,
  ];
}
