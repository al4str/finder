/**
 * @param {BuildParams} params
 * */
export async function configGetPluginReactRefresh(params) {
  if (params.production) {
    return null;
  }
  const { default: ReactRefreshPlugin } = await import('@pmmmwh/react-refresh-webpack-plugin');

  return new ReactRefreshPlugin();
}
