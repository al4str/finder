import config from '../../../webpack.config.cjs';

/**
 * @param {BuildParams} params
 * */
export async function configGetPluginEslint(params) {
  if (params.production) {
    return null;
  }
  const { default: ESLintPlugin } = await import('eslint-webpack-plugin');

  return new ESLintPlugin({
    extensions: config.resolve.extensions,
    lintDirtyModulesOnly: true,
    threads: true,
    cache: true,
    cacheLocation: 'node_modules/.cache/eslint'
  });
}
