import path from 'path';
import { DIST_DIR, PORT, HOST } from '../constants.js';
import { serverCreate } from '../utils/server.js';

(async function() {
  await serve();
}());

async function serve() {
  const indexHtml = path.join(DIST_DIR, 'index.html');
  const indexMiddleware = (app) => {
    app.get('*', (_, res) => {
      res.sendFile(indexHtml);
    });
  };
  serverCreate({
    host: HOST,
    port: PORT,
    staticDir: DIST_DIR,
    middlewares: [
      indexMiddleware,
    ],
  });
}
