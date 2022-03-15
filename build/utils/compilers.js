import webpack from 'webpack';

/**
 * @typedef {import('webpack').Configuration} Config
 * */

/**
 * @param {Config} config
 * @return {function(): Promise<BuildCompileResults>}
 * */
export function compilersGet(config) {
  const compiler = webpack(config);

  return () => new Promise((resolve) => {
    compiler.run((err, stats) => {
      resolve({ err, stats });
    });
  });
}
