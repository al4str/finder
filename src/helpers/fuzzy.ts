import stringSimilarity from 'jaro-winkler';
import { CountryDataItemShort } from '@/types/countries';

const SIMILARITY_THRESHOLD = 0.7;

export function fuzzy(
  query: string,
  items: CountryDataItemShort[],
): CountryDataItemShort[] {
  return items
    .map((item) => {
      const searchQuery = query.toLowerCase();
      const commonName = (item.name?.common || '').toLowerCase();
      const officialName = (item.name?.official || '').toLowerCase();

      return {
        data: item,
        commonName,
        byCommon: stringSimilarity(searchQuery, commonName),
        byOfficial: stringSimilarity(searchQuery, officialName),
      };
    })
    .filter((item) => {
      return item.byCommon >= SIMILARITY_THRESHOLD
        || item.byOfficial >= SIMILARITY_THRESHOLD;
    })
    .sort((a, b) => {
      return a.byCommon - b.byCommon
        || a.byOfficial - b.byOfficial
        || a.commonName.localeCompare(b.commonName);
    })
    .map((item) => item.data);
}
