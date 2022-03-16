// Note: webpack loaders must be commonjs modules

/**
 * @typedef {import('webpack').Loader} WebpackLoader
 * */

/**
 * Ignores CSS files
 *
 * @type {() => WebpackLoader}
 */
const CssIgnoreWebpackLoader = () => {
  if (typeof this.cacheable === 'function') {
    this.cacheable();
  }

  return '';
}

module.exports = CssIgnoreWebpackLoader;
