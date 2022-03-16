import path from 'path';
import { ROOT_DIR } from '../../constants.js';
import { configGetLoaderPostcss } from './postcss.js';
import { configGetLoaderCSS } from './css.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderStyles(params) {
  return {
    test: /\.css$/,
    use: params.production && params.modern
      ? [
        {
          loader: path.resolve(ROOT_DIR, 'build/css/css-ignore-loader.cjs'),
        },
      ]
      : [
        await configGetLoaderCSS(params),
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            sourceMap: !params.production,
          },
        },
        await configGetLoaderPostcss(params),
      ],
  };
}
