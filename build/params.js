import dotenv from 'dotenv';

try {
  dotenv.config();
}
catch (err) {
  // silence
}

/**
 * @return {BuildParams}
 * */
export function buildGetParams() {
  return {
    analyze: process.env.ANALYZE_BUNDLE === '1',
    production: process.env.NODE_ENV === 'production',
    modern: process.env.BROWSERSLIST_ENV === 'modern',
  };
}
