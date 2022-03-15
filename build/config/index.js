import {
  configGetContext,
  configGetMode,
  configGetTarget,
  configGetStats,
  configGetEntry,
  configGetDevtool,
  configGetOutput,
  configGetResolve,
  configGetOptimization,
  configGetDevServer,
  configGetCache,
} from './fields/index.js';
import { configGetLoaders } from './loaders/index.js';
import { configGetPlugins } from './plugins/index.js';

/**
 * @typedef {import('webpack').Configuration} WebpackConfig
 * */

/**
 * @typedef {import('webpack-dev-server').Configuration} DevServerConfig
 * */

/**
 * @typedef {Object} Config
 * @property {WebpackConfig.context} context
 * @property {WebpackConfig.mode} mode
 * @property {WebpackConfig.target} target
 * @property {WebpackConfig.stats} stats
 * @property {WebpackConfig.entry} entry
 * @property {WebpackConfig.devtool} devtool
 * @property {DevServerConfig} devServer
 * @property {WebpackConfig.output} output
 * @property {WebpackConfig.resolve} resolve
 * @property {WebpackConfig.optimization} optimization
 * @property {WebpackConfig.module} module
 * @property {WebpackConfig.plugins} plugins
 * @property {WebpackConfig.cache} cache
 * */

/**
 * @param {BuildParams} params
 * @return {Promise<Config>}
 * */
export async function configGet(params) {
  return {
    context: await configGetContext(params),
    mode: await configGetMode(params),
    target: await configGetTarget(params),
    stats: await configGetStats(params),
    entry: await configGetEntry(params),
    devtool: await configGetDevtool(params),
    devServer: await configGetDevServer(params),
    output: await configGetOutput(params),
    resolve: await configGetResolve(params),
    optimization: await configGetOptimization(params),
    module: {
      rules: await configGetLoaders(params),
    },
    plugins: await configGetPlugins(params),
    cache: await configGetCache(params),
  };
}
