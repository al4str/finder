import express from 'express';
import compression from 'compression';
import serveStatic from 'serve-static';

/**
 * @param {Object} params
 * @param {string} params.host
 * @param {number} params.port
 * @param {string} params.staticDir
 * @param {Array<Function>} [params.middlewares]
 * @return {function(): Promise<void>}
 * */
export function serverCreate(params) {
  const {
    host,
    port,
    staticDir,
    middlewares,
  } = params;

  const app = express();

  app.use(compression());

  app.use(serveStatic(staticDir, {
    setHeaders(res, path) {
      if (serveStatic.mime.lookup(path) === 'text/html') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      else {
        res.setHeader('Cache-Control', 'public');
        res.setHeader('Expires', '1y');
      }
    },
  }));

  if (middlewares) {
    middlewares.forEach((applyMiddleware) => {
      applyMiddleware(app);
    });
  }

  app.listen(port, host, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    else {
      console.info(`https://${host}:${port}`);
    }
  });
}
