import { CountryCode } from '@/typings/countries';
import { LocalStorageResult, useLocalStorage } from '@/hooks/localStorage';

const STORAGE_KEY = 'FINDER_FAVORITES';

const STORAGE_FALLBACK: CountryCode[] = [];

export function useFavorites(): LocalStorageResult<CountryCode[]> {
  return useLocalStorage<CountryCode[]>(STORAGE_KEY, STORAGE_FALLBACK);
}
