// Note: webpack loaders must be commonjs modules

/**
 * @typedef {import('webpack').Loader} WebpackLoader
 * */

/**
 * Ignores CSS files
 *
 * @instance
 * @memberof WebpackLoader
 *
 * @return {WebpackLoader}
 */
function CssIgnoreWebpackLoader() {
  if (typeof this.cacheable === 'function') {
    this.cacheable();
  }

  return '';
}

module.exports = CssIgnoreWebpackLoader;
