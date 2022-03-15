/**
 * @param {BuildParams} params
 * */
export async function configGetDevtool(params) {
  return params.production
    ? false
    : 'eval-source-map';
}
