import { targetsGetConfig } from '../../utils/targets.js';
import safariBorderRadiusClipFix from '../../postcss/safari-border-radius/index.js';

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
          safariBorderRadiusClipFix(),
          ['postcss-preset-env', {
            browsers: targetsGetConfig(false),
          }],
          'autoprefixer',
          'cssnano',
        ],
      },
    },
  };
}
