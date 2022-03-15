import Terser from 'terser-webpack-plugin';
import CssMinimizer from 'css-minimizer-webpack-plugin';

/**
 * @typedef {import('webpack').Module} Module
 * */

/**
 * @typedef {import('webpack').Configuration} Config
 * */

const FRAMEWORK_PACKAGES = [
  'classnames',
  'history',
  'mini-create-react-context',
  'hoist-non-react-statics',
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  'react-is',
  'scheduler',
].join('|');

const FRAMEWORK_REG_EXP = new RegExp(
  `node_modules/(${FRAMEWORK_PACKAGES})`,
  'i',
);

/**
 * @param {Module} module
 * @return {boolean}
 * */
function isNotCssModule(module) {
  return module.type !== 'css/mini-extract';
}

/**
 * @param {BuildParams} params
 * @return {Partial<Config.optimization>}
 * */
export async function configGetOptimization(params) {
  if (params.production) {
    const terser = new Terser({
      terserOptions: {
        safari10: !params.modern,
      },
    });
    const cssMinimizer = new CssMinimizer();

    return {
      realContentHash: true,
      minimizer: [
        '...',
        terser,
        cssMinimizer,
      ],
      minimize: true,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          defaultVendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: FRAMEWORK_REG_EXP,
            priority: 15,
            enforce: true,
          },
          libs: {
            /**
             * @param {Module} module
             * @return {boolean}
             * */
            test(module) {
              return !isNotCssModule(module)
                && module.size() > 100000
                && /node_modules/.test(module.identifier());
            },
            /**
             * @param {Module} module
             * @return {string}
             * */
            name(module) {
              const moduleFileName = module
                .identifier()
                .split('/')
                .reduceRight((item) => item)
                .replace(/\.js$/, '');

              return `libs.${moduleFileName}`;
            },
            priority: 10,
            minChunks: 1,
          },
          commons: {
            name: 'commons',
            minChunks: 5,
            priority: 5,
          },
        },
      },
    };
  }

  return {
    realContentHash: false,
  };
}
