import path from 'path';
import { ROOT_DIR } from '../../constants.js';
import { configGetLoaderPostcss } from './postcss.js';
import { configGetLoaderCSS } from './css.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderCssModules(params) {
  return {
    test: /\.module\.css$/,
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
          url: true,
          import: false,
          modules: {
            mode: 'local',
            localIdentName: '[local]--[hash:base64]',
            localIdentHashDigestLength: 8,
          },
          importLoaders: 1,
          sourceMap: !params.production,
        },
      },
      await configGetLoaderPostcss(params),
    ],
  };
}
