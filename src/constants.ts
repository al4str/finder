export const ENV_NODE = process.env.NODE_ENV || 'production';

export const IS_PRODUCTION = ENV_NODE === 'production';

export const ENV_MODERNITY = process.env.BUILD_MODERNITY || 'modern';

export const ENV_DEPLOY = process.env.DEPLOY_ENV || 'local';

export const KEY_MAPTILER = process.env.SECRETS_KEY_MAPTILER || '';

export const GLOBAL_NAME_ASSETS = '__INJECTABLE_ASSETS__';

export const GLOBAL_NAME_CHUNKS = '__INJECTABLE_CHUNKS__';

export const API_URL = 'https://restcountries.com/v3.1';
