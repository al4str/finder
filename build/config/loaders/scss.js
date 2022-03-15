import Sass from 'sass';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderSCSS(params) {
  return {
    loader: 'sass-loader',
    options: {
      sourceMap: !params.production,
      implementation: Sass,
    },
  };
}
