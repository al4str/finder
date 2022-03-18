import { GLOBAL_NAME_ASSETS } from '@/constants';

const ASSETS_MAP = window[GLOBAL_NAME_ASSETS];

export function assetsGetURL(fileName: string): string {
  return ASSETS_MAP[fileName] || '';
}
