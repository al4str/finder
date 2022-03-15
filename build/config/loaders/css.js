import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderCSS(params) {
  if (params.production) {
    return {
      loader: MiniCssExtractPlugin.loader,
    };
  }
  return {
    loader: 'style-loader',
  };
}
