import { Suspense } from 'react';
import { RoutesBoundary } from '@/components/Routes/Boundary';
import { RoutesSwitcher } from '@/components/Routes/Switcher';
import { searchInit } from '@/helpers/search';
import { photosInit } from '@/helpers/photos';

void searchInit();

photosInit();

export function App(): JSX.Element {
  return (
    <RoutesBoundary>
      <Suspense fallback={null}>
        <RoutesSwitcher />
      </Suspense>
    </RoutesBoundary>
  );
}
