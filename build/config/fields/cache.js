/**
 * @param {BuildParams} params
 * */
export async function configGetCache(params) {
  return {
    type: 'filesystem',
    compression: false,
  };
}
