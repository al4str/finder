import { GLOBAL_NAME_CHUNKS } from '@/constants';
import { routesGetParams } from '@/helpers/routes';

export type ResourceHint = string | 'prefetch' | 'preload' | 'modulepreload';

export type ChunksMap = Map<string, string[]>;

const CHUNKS_MAP: ChunksMap = (function() {
  const map: ChunksMap = new Map();
  const chunksCollection = window[GLOBAL_NAME_CHUNKS];

  return Object
    .entries(chunksCollection)
    .reduce((result, [name, urls]) => {
      result.set(name, urls);

      return result;
    }, map);
}());

const RESOURCES_MAP = new Map<string, HTMLElement[]>();

export function chunksAddResourceHints(route: string, hint: ResourceHint): void {
  prepareChunksByRoute(route, hint);
}

export function chunksClearResourceHints(route: string): void {
  const routeResources: HTMLElement[] = RESOURCES_MAP.get(route)
    || [] as HTMLElement[];
  if (!routeResources.length) {
    return;
  }
  routeResources.forEach((el) => {
    if (el instanceof Node && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
  RESOURCES_MAP.delete(route);
}

function prepareChunksByRoute(route: string, hint: ResourceHint = 'prefetch'): void {
  const chunks = getChunksByRoute(route);
  if (!chunks.length) {
    return;
  }
  const routeResources: HTMLElement[] = [];
  chunks
    .filter((url) => {
      return getExistingResourceHints(url, hint).length === 0;
    })
    .forEach((url) => {
      const link = window.document.createElement('link');
      link.rel = getHint(url, hint);
      link.as = getDirective(url);
      link.href = url;
      link.crossOrigin = 'anonymous';
      window.document.head.appendChild(link);
      routeResources.push(link);
    });
  RESOURCES_MAP.set(route, routeResources);
}

function getChunksByRoute(route: string): string[] {
  const routeParams = routesGetParams(route);
  const chunkNames = routeParams.chunks;

  if (!chunkNames.length) {
    return [];
  }
  return chunkNames.reduce((result, chunkName) => {
    const chunks = CHUNKS_MAP.get(chunkName) || [];

    return result.concat(chunks);
  }, [] as string[]);
}

function getHint(url: string, hint: string): ResourceHint {
  return /modern\.[\d\w]{8}\.js$/.test(url)
    ? 'modulepreload'
    : hint;
}

function getDirective(url: string): string|'script'|'style' {
  if (/\.css$/i.test(url)) {
    return 'style';
  }
  if (/\.js$/i.test(url)) {
    return 'script';
  }
  return '';
}

function getTagSelector(url: string): null | string {
  if (/\.css$/i.test(url)) {
    return `link[rel="stylesheet"][href="${url}"]`;
  }
  if (/\.js$/i.test(url)) {
    return `script[src="${url}"]`;
  }
  return null;
}

function getExistingResourceHints(url: string, rawHint: ResourceHint): Element[] {
  const hint = getHint(url, rawHint);
  const tagSelector = getTagSelector(url);
  const linkSelector = `link[rel="${hint}"][href="${url}"]`;
  const results: Element[] = [];
  if (tagSelector) {
    const tagElement = window.document.head.querySelector(tagSelector);
    if (tagElement) {
      results.push(tagElement);
    }
  }
  const linkElement = window.document.head.querySelector(linkSelector);
  if (linkElement) {
    results.push(linkElement);
  }

  return results;
}
