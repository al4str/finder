import { Suspense } from 'react';
import { RoutesBoundary } from '@/components/Routes/Boundary';
import { RoutesSwitcher } from '@/components/Routes/Switcher';

export function App(): JSX.Element {
  return (
    <RoutesBoundary>
      <Suspense fallback={null}>
        <RoutesSwitcher />
      </Suspense>
    </RoutesBoundary>
  );
}
