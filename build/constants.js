import path from 'path';
import dotenv from 'dotenv';

try {
  dotenv.config();
}
catch (err) {
  // silence
}

export const ROOT_DIR = process.cwd();

export const DIST_DIR = path.join(ROOT_DIR, 'dist');

export const PORT = process.env.DEV_PORT || '';

export const HOST = process.env.DEV_HOST || '';

export const PUBLIC_PATH = '/';

export const MAIN_CHUNK_GROUP = 'main';

export const INJECTABLE_KEY_ASSETS = '__INJECTABLE_ASSETS__';

export const INJECTABLE_KEY_CHUNKS = '__INJECTABLE_CHUNKS__';

/** @type {Array<BuildLinkItem>} */
export const LINK_ITEMS = [
  {
    originalPath: 'assets/favicon.svg',
    attributes: {
      rel: 'icon',
      type: 'image/svg+xml',
    },
  },
  {
    originalPath: 'assets/apple-touch-icon.png',
    attributes: {
      rel: 'apple-touch-icon',
    },
  },
];
