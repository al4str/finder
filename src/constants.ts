export const ENV_NODE = process.env.NODE_ENV || 'production';

export const IS_PRODUCTION = ENV_NODE === 'production';

export const KEY_MAPTILER = process.env.SECRETS_KEY_MAPTILER || '';

export const KEY_UNSPLASH = process.env.SECRETS_KEY_UNSPLASH || '';

export const GLOBAL_NAME_CHUNKS = '__INJECTABLE_CHUNKS__';

export const API_URL = 'https://restcountries.com/v3.1';
