import { configGetPluginAnalyze } from './analyze.js';
import { configGetPluginCopy } from './copy.js';
import { configGetPluginCSS } from './css.js';
import { configGetPluginDotenv } from './dotenv.js';
import { configGetPluginReactRefresh } from './reactRefresh.js';

const plugins = [
  configGetPluginAnalyze,
  configGetPluginCopy,
  configGetPluginCSS,
  configGetPluginDotenv,
  configGetPluginReactRefresh,
];

/**
 * @param {BuildParams} params
 * */
export async function configGetPlugins(params) {
  const results = await Promise.all(plugins.map((plugin) => {
    return plugin(params);
  }));

  return results.filter(Boolean);
}
