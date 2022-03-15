import { configGetLoaderScripts } from './scripts.js';
import { configGetLoaderStyles } from './styles.js';
import { configGetLoaderSVG } from './svg.js';

const loaders = [
  configGetLoaderScripts,
  configGetLoaderSVG,
  configGetLoaderStyles,
];

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaders(params) {
  const results = await Promise.all(loaders.map((loader) => {
    return loader(params);
  }));

  return results.filter(Boolean);
}
