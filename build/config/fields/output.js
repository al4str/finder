import { DIST_DIR, PUBLIC_PATH } from '../../constants.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetOutput(params) {
  const { modern, production } = params;
  const type = modern
    ? 'modern'
    : 'legacy';

  return {
    filename: production
      ? `${type}/[name].${type}.[contenthash:8].js`
      : `${type}/[name].${type}.[fullhash].js`,
    chunkFilename: production
      ? `${type}/[name].${type}.[contenthash:8].js`
      : `${type}/[name].${type}.[fullhash].js`,
    assetModuleFilename: production
      ? '[name].[contenthash:8][ext]'
      : '[name].[fullhash][ext]',
    path: DIST_DIR,
    publicPath: PUBLIC_PATH,
    scriptType: modern
      ? 'module'
      : 'text/javascript',
  };
}
