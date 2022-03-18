import 'ol/ol.css';
import OpenLayerMap from 'ol/Map';
import OpenLayerLayerTile from 'ol/layer/Tile';
import OpenLayerView from 'ol/View';
import OpenLayerSourceXYZ from 'ol/source/XYZ';
import OpenLayerPoint from 'ol/geom/Point';
import { useGeographic as geo } from 'ol/proj';
import { memo, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Coordinates } from '@/types/coordinates';
import { KEY_MAPTILER } from '@/constants';
import { useMapStore, mapGetState } from '@/helpers/map';
import { useViewportSize } from '@/hooks/viewportSize';

geo();

const DURATION = 1500;

interface Props {
  className?: string;
}

export const Map = memo((props: Props): JSX.Element => {
  const { className = '' } = props;
  const { visualWidth } = useViewportSize();
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
      padding: getPadding(),
      maxZoom: zoom,
      duration: DURATION,
    });
  }, [visualWidth, coordinates, zoom]);

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
      new OpenLayerLayerTile({
        source: new OpenLayerSourceXYZ({
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

function getPoint(coordinates: Coordinates): OpenLayerPoint {
  return new OpenLayerPoint(getCoordinates(coordinates));
}

function getCoordinates(coordinates: Coordinates): Coordinates {
  const [lat = 0, lng = 0] = coordinates;

  return [lng, lat];
}

const SAFE_MARGIN = 12;

function getPadding(): [number, number, number, number] {
  const header = window.document.getElementById('header');
  const space = window.document.getElementById('space');
  const headerHeight = header instanceof HTMLElement
    ? header.clientHeight
    : SAFE_MARGIN;
  const spaceHeight = space instanceof HTMLElement
    ? space.clientHeight
    : SAFE_MARGIN;

  return [
    SAFE_MARGIN,
    SAFE_MARGIN,
    spaceHeight + headerHeight + 2 * SAFE_MARGIN,
    SAFE_MARGIN,
  ];
}
