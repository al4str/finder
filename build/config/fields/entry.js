import { MAIN_CHUNK_GROUP } from '../../constants.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetEntry(params) {
  const mainEntry = params.modern
    ? ['./src/entry/modern.ts']
    : ['./src/entry/legacy.ts'];

  return {
    [MAIN_CHUNK_GROUP]: mainEntry,
  };
}
