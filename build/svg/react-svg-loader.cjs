// Note: webpack loaders must be commonjs modules
const { transformSync } = require("@babel/core");
const babelPluginSyntaxJsx = require("@babel/plugin-syntax-jsx");
const babelPluginReactSvg = require("babel-plugin-react-svg");

/**
 * @typedef {import('webpack').Loader} WebpackLoader
 * */

/**
 * Transforms SVG imports
 *
 * @type {(content: any) => WebpackLoader}
 */
const ReactSvgWebpackLoader = (content) => {
  const cb = this.async();

  Promise.resolve(String(content))
    .then((content) => {
      return transformSync(content, {
        babelrc: false,
        configFile: false,
        presets: [],
        plugins: [babelPluginSyntaxJsx, babelPluginReactSvg]
      });
    })
    .then((result) => cb(null, result.code))
    .catch(err => cb(err));
}

module.exports = ReactSvgWebpackLoader;
