// Webpack alias path resolving for IDE (e.g., Webstorm)
// Note: `eslint-import-resolver-webpack` does not support `esm`
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
    extensions: ['.js', '.d.ts', '.ts', '.tsx'],
  },
};
