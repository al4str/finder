import { memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { equal } from '@/utils/equal';
import { ROUTES_PAGES } from '@/components/Routes/Pages';
import { RoutesRouter } from '@/components/Routes/Router';
import { RoutesWrapper } from '@/components/Routes/Wrapper';
import { RoutesBoundary } from '@/components/Routes/Boundary';
import { RoutesNotFound } from '@/components/Routes/NotFound';
import { LayoutsDefault } from '@/components/Layouts/Default';

function Switcher(): JSX.Element {
  return (
    <RoutesRouter>
      <Routes>
        {ROUTES_PAGES.map((page) => {
          const { url, Component } = page;

          return (
            <Route
              key={url}
              path={url}
              element={(
                <LayoutsDefault>
                  <RoutesWrapper>
                    <RoutesBoundary withLink={false}>
                      <Component />
                    </RoutesBoundary>
                  </RoutesWrapper>
                </LayoutsDefault>
              )}
            />
          );
        })}
        <Route path="*" element={<RoutesNotFound />} />
      </Routes>
    </RoutesRouter>
  );
}

export const RoutesSwitcher = memo(Switcher, equal);
