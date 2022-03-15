import path from 'path';
import { ROOT_DIR } from '../../constants.js';
import { configGetLoaderBabel } from './babel.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderSVG(params) {
  return {
    test: /\.svg$/,
    exclude: /node_modules/,
    use: [
      await configGetLoaderBabel(params),
      {
        loader: path.resolve(ROOT_DIR, 'build/svg/react-svg-loader.cjs'),
      },
    ],
  };
}
