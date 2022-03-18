import CopyPlugin from 'copy-webpack-plugin';

/**
 * @param {BuildParams} params
 * */
export async function configGetPluginCopy(params) {
  return new CopyPlugin({
    patterns: [
      {
        from: './src/public/favicon.ico',
        to: 'favicon.ico',
        noErrorOnMissing: false,
      },
      {
        from: './src/public/assets/*',
        to: 'assets/[name].[contenthash:8][ext]',
        toType: 'template',
        noErrorOnMissing: false,
      },
      {
        from: './src/public/geo/*',
        to: 'geo/[name].[contenthash:8][ext]',
        toType: 'template',
        noErrorOnMissing: false,
      },
    ],
  });
}
