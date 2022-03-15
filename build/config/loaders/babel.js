import { targetsGetConfig } from '../../utils/targets.js';
import babelPluginWebpackChunkName from '../../babel/webpack-chunk-name/index.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderBabel(params) {
  const targets = targetsGetConfig(params.modern);
  const corejs = params.modern
    ? undefined
    : 3;
  const useBuiltIns = params.modern
    ? false
    : 'usage';
  const plugins = [
    params.production
      ? null
      : await import('react-refresh/babel.js').default,
    babelPluginWebpackChunkName,
  ].filter(Boolean);

  return {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      presets: [
        ['@babel/preset-env', {
          bugfixes: true,
          modules: 'auto',
          corejs,
          useBuiltIns,
          targets,
        }],
        ['@babel/preset-typescript', {
          allowDeclareFields: true,
          onlyRemoveTypeImports: true,
        }],
        ['@babel/preset-react', {
          runtime: 'automatic',
        }],
      ],
      plugins,
      cacheDirectory: true,
      cacheCompression: false,
    },
  };
}
