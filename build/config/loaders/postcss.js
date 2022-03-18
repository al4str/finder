import { targetsGetConfig } from '../../utils/targets.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderPostcss(params) {
  return {
    loader: 'postcss-loader',
    options: {
      sourceMap: !params.production,
      postcssOptions: {
        plugins: [
          ['postcss-preset-env', {
            browsers: targetsGetConfig(false),
          }],
          'tailwindcss',
          'autoprefixer',
          'cssnano',
        ],
      },
    },
  };
}
