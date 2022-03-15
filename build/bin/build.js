import { join } from 'path';
import { DIST_DIR } from '../constants.js';
import { fsMakeOrClearDir, fsWriteFile } from '../utils/fs.js';
import { templatesRender } from '../utils/templates.js';
import { compilersGet } from '../utils/compilers.js';
import { configGet } from '../config/index.js';
import { buildGetParams } from '../params.js';

(async function() {
  await build();
})();

export async function build() {
  try {
    console.info('Warming up');
    const { analyze } = buildGetParams();
    await fsMakeOrClearDir(DIST_DIR);
    const configs = await Promise.all([
      configGet({
        analyze,
        production: true,
        modern: true,
      }),
      configGet({
        analyze,
        production: true,
        modern: false,
      }),
    ]);
    const compilers = configs.map((config) => compilersGet(config));
    console.info('Compiling modern and legacy bundles');
    /** @type {Array<BuildCompileResults>} */
    const results = await Promise.all(compilers.map((compiler) => {
      return compiler();
    }));
    const anyBuildFailed = results.reduce((errorsCount, result, index) => {
      const { stats } = result;
      const config = configs[index];
      const { errors } = stats.toJson(config.stats);
      if (errors.length > 0) {
        errors.forEach((err) => {
          console.error(new Error(err.message));
        })
      }
      return errorsCount + errors.length;
    }, 0);
    if (anyBuildFailed) {
      return;
    }
    const [modernBuildResult, legacyBuildResult] = results;
    console.info('Compiling templates');
    const html = templatesRender({
      production: true,
      statsList: [
        modernBuildResult.stats,
        legacyBuildResult.stats,
      ],
    });
    const htmlPath = join(DIST_DIR, 'index.html');
    await fsWriteFile(htmlPath, html);
    console.info('Finished');
  }
  catch (err) {
    console.error(err);
  }
}
