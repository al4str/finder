import { matchPath } from 'react-router-dom';

export const ROUTES = {
  main: '/',
  history: '/history',
  favorites: '/favorites',
  search: '/search',
  country: '/country/:code',
} as const;

export type RouteName = keyof typeof ROUTES;

export type RoutePath = typeof ROUTES[RouteName];

export interface RouteParams {
  chunks: string[];
}

const ROUTES_PARAMS: Record<RoutePath, RouteParams> = {
  [ROUTES.main]: {
    chunks: [
      'components--Main--Page',
    ],
  },
  [ROUTES.history]: {
    chunks: [
      'components--History--Page',
    ],
  },
  [ROUTES.favorites]: {
    chunks: [
      'components--Favorites--Page',
    ],
  },
  [ROUTES.search]: {
    chunks: [
      'components--Search--Page',
    ],
  },
  [ROUTES.country]: {
    chunks: [
      'components--Country-Page',
    ],
  },
};

export function routesGetParams(pathname: string): RouteParams {
  const routeParamsEntry = Object
    .entries(ROUTES_PARAMS)
    .find(([routePath]) => Boolean(matchPath(routePath, pathname)));
  const [, routeParams] = routeParamsEntry || [];
  const { chunks = [] } = routeParams || {};

  return {
    chunks,
  };
}

export function routesDoesMatch(pathname = '', matchers: string[] = []): boolean {
  const index = matchers.findIndex((routePath) => {
    return Boolean(matchPath(routePath, pathname));
  });

  return index !== -1;
}

export function routesReplace(
  pathname: string,
  replacers: Record<string | 'code', string>,
): string {
  return Object
    .entries(replacers)
    .reduce((result, [name, value]) => {
      const regExp = new RegExp(`:${name}[?]?`, 'gi');

      return result.replace(regExp, value);
    }, pathname || '');
}
