import { configGetLoaderBabel } from './babel.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderScripts(params) {
  return {
    test: /\.[tj]sx?$/,
    exclude: [/node_modules/],
    use: [
      await configGetLoaderBabel(params),
    ],
  };
}
