import CopyPlugin from 'copy-webpack-plugin';

/**
 * @param {BuildParams} params
 * */
export async function configGetPluginCopy(params) {
  return new CopyPlugin({
    patterns: [
      {
        from: `./src/static/favicon.ico`,
        to: 'favicon.ico',
        noErrorOnMissing: true,
      },
    ],
  });
}
