import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const ROOT_DIR = process.cwd();

export const DIST_DIR = path.join(ROOT_DIR, 'dist');

export const PORT = process.env.DEV_PORT || '';

export const HOST = process.env.DEV_HOST || '';

export const DEPLOY_ENV = process.env.DEPLOY_ENV || 'local';

export const PUBLIC_PATH = '/';

export const MAIN_CHUNK_GROUP = 'main';

export const INJECTABLE_KEY_ASSETS = '__INJECTABLE_ASSETS__';

export const INJECTABLE_KEY_CHUNKS = '__INJECTABLE_CHUNKS__';

/** @type {Array<BuildLinkItem>} */
export const LINK_ITEMS = [
  {
    originalPath: 'assets/brand/favicon.svg',
    attributes: {
      rel: 'icon',
      type: 'image/svg+xml',
    },
  },
  {
    originalPath: 'assets/brand/apple-touch-icon.png',
    attributes: {
      rel: 'apple-touch-icon',
    },
  },
];
