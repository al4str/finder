import { Suspense } from 'react';
import { RoutesBoundary } from '@/components/Routes/Boundary';
import { RoutesSwitcher } from '@/components/Routes/Switcher';
import { searchInit } from '@/helpers/search';
import { photosInit } from '@/helpers/photos';
import { viewportInit } from '@/hooks/viewportSize';
import { mapInit } from '@/helpers/map';
import { exceptionsInit } from '@/utils/exceptions';

exceptionsInit();

viewportInit();

void searchInit();

photosInit();

void mapInit();

export function App(): JSX.Element {
  return (
    <RoutesBoundary>
      <Suspense fallback={null}>
        <RoutesSwitcher />
      </Suspense>
    </RoutesBoundary>
  );
}
