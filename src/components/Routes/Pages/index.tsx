import { ComponentType, lazy } from 'react';
import { ROUTES } from '@/helpers/routes';

export interface RoutePage {
  url: string;
  Component: ComponentType<unknown>;
}

export const ROUTES_PAGES: RoutePage[] = [
  {
    url: ROUTES.main,
    Component: lazy(() => import('@/components/Main/Page')
      .then((module) => ({ default: module.MainPage }))),
  },
  {
    url: ROUTES.history,
    Component: lazy(() => import('@/components/History/Page')
      .then((module) => ({ default: module.HistoryPage }))),
  },
  {
    url: ROUTES.favorites,
    Component: lazy(() => import('@/components/Favorites/Page')
      .then((module) => ({ default: module.FavoritesPage }))),
  },
  {
    url: ROUTES.country,
    Component: lazy(() => import('@/components/Country/Page')
      .then((module) => ({ default: module.CountryPage }))),
  },
];
