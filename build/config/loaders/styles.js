import { configGetLoaderSCSS } from './scss.js';
import { configGetLoaderPostcss } from './postcss.js';
import { configGetLoaderCSS } from './css.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderStyles(params) {
  return {
    test: /\.scss$/,
    use: [
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
          importLoaders: 2,
          sourceMap: !params.production,
        },
      },
      await configGetLoaderPostcss(params),
      await configGetLoaderSCSS(params),
    ],
  };
}
