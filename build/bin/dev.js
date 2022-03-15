import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { templatesRender } from '../utils/templates.js';
import { configGet } from '../config/index.js';
import { buildGetParams } from '../params.js';

/**
 * @typedef {import('webpack').Stats} Stats
 * */

(async function() {
  await build();
}());

async function build() {
  try {
    const { modern, analyze } = buildGetParams();
    const config = await configGet({
      production: false,
      modern,
      analyze,
    });
    const compiler = webpack(config);
    const server = new WebpackDevServer(config.devServer, compiler);
    compiler.hooks.done.tapAsync(
      'DevDonePlugin',
      /**
       * @param {Stats} stats
       * @param {Function} callback
       */
      async (stats, callback) => {
        /**
         * @param {string} html
         * @return {Promise<null | Error>}
         * */
        const writeHTML = (html) => {
          return new Promise((resolve, reject) => {
            const writeFile = compiler.outputFileSystem.writeFile;
            const htmlPath = path.join(compiler.outputPath, 'index.html');
            writeFile(htmlPath, html, (err) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(null);
            });
          });
        };
        const err = await createAndInjectIndexHTML({
          writeHTML,
          stats,
        });
        callback(err);
      },
    );
    await server.start();
  }
  catch (err) {
    console.error(err);
  }
}

/**
 * @param {Object} params
 * @param {function(html: string): Promise<null | Error>} params.writeHTML
 * @param {Stats} params.stats
 * @return {Promise<null | Error>}
 * */
async function createAndInjectIndexHTML(params) {
  const {
    writeHTML,
    stats,
  } = params;
  if (stats.hasErrors()) {
    return null;
  }
  try {
    const html = templatesRender({
      production: false,
      statsList: [stats],
    });
    await writeHTML(html);
    return null;
  }
  catch (err) {
    return err;
  }
}
