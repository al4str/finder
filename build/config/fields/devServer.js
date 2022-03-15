import {
  DIST_DIR,
  PORT,
  HOST,
  PUBLIC_PATH,
} from '../../constants.js';

/**
 * @typedef {import('webpack-dev-server').Configuration} DevServerConfig
 * */

/**
 * @param {BuildParams} params
 * @return {DevServerConfig}
 * */
export async function configGetDevServer(params) {
  const { production } = params;

  if (production) {
    return {};
  }
  return {
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    port: PORT,
    host: HOST,
    static: [
      DIST_DIR,
    ],
    devMiddleware: {
      publicPath: PUBLIC_PATH,
      index: 'index.html',
    },
  };
}
