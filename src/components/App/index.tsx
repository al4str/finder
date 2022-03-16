import { Suspense } from 'react';
import { RoutesBoundary } from '@/components/Routes/Boundary';
import { RoutesSwitcher } from '@/components/Routes/Switcher';
import { searchInit } from '@/helpers/search';

void searchInit();

export function App(): JSX.Element {
  return (
    <RoutesBoundary>
      <Suspense fallback={null}>
        <RoutesSwitcher />
      </Suspense>
    </RoutesBoundary>
  );
}
