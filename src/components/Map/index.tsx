import 'ol/ol.css';
import OpenLayerMap from 'ol/Map';
import OpenLayerTileLayer from 'ol/layer/Tile';
import OpenLayerView from 'ol/View';
import OpenLayerXYZ from 'ol/source/XYZ';
import OpenLayerPoint from 'ol/geom/Point';
import { transform } from 'ol/proj';
import { memo, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { KEY_MAPTILER } from '@/constants';
import { MapCoordinates, useMapStore, mapGetState } from '@/helpers/map';
import { useViewportSize } from '@/hooks/viewportSize';

const DURATION = 2000;

interface Props {
  className?: string;
}

export const Map = memo((props: Props): JSX.Element => {
  const { className = '' } = props;
  const sizes = useViewportSize();
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<OpenLayerMap>(getMap());
  const viewRef = useRef<OpenLayerView>(getView());
  const { coordinates, zoom } = useMapStore();

  useEffect(() => {
    const el = elRef.current;
    const map = mapRef.current;
    const view = viewRef.current;
    if (el instanceof HTMLDivElement) {
      map.setTarget(el);
      map.setView(view);
    }
  }, []);
  useEffect(() => {
    const map = mapRef.current;
    const view = viewRef.current;
    const point = getPoint(coordinates);
    map.updateSize();
    view.fit(point, {
      size: map.getSize(),
      padding: getPadding(),
      maxZoom: zoom,
      duration: DURATION,
    });
  }, [sizes, coordinates, zoom]);

  return (
    <div className={clsx('pointer-events-none', className)}>
      <div className="absolute top-0 left-0 w-full h-full" ref={elRef}>
      </div>
    </div>
  );
});

const URL = 'https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}@2x.jpg';

function getMap(): OpenLayerMap {
  return new OpenLayerMap({
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

function getView(): OpenLayerView {
  const { coordinates, zoom } = mapGetState();
  const center = getCoordinates(coordinates);
  const padding = getPadding();

  return new OpenLayerView({
    projection: 'EPSG:3857',
    center,
    zoom,
    padding,
  });
}

function getPoint(coordinates: MapCoordinates): OpenLayerPoint {
  return new OpenLayerPoint(getCoordinates(coordinates));
}

function getCoordinates(coordinates: MapCoordinates): MapCoordinates {
  const [lat = 0, lng = 0] = coordinates;

  return transform([lng, lat], 'EPSG:4326', 'EPSG:3857');
}

const SAFE_MARGIN = 12;

function getPadding(): [number, number, number, number] {
  const header = window.document.getElementById('header');
  const space = window.document.getElementById('space');
  const headerHeight = header instanceof HTMLElement
    ? header.clientHeight + SAFE_MARGIN
    : SAFE_MARGIN;
  const spaceHeight = space instanceof HTMLElement
    ? space.clientHeight
    : SAFE_MARGIN;

  return [
    headerHeight,
    SAFE_MARGIN,
    spaceHeight,
    SAFE_MARGIN,
  ];
}
