import stringSimilarity from 'jaro-winkler';
import { CountryDataItemShort } from '@/typings/countries';

const SIMILARITY_THRESHOLD = 0.7;

export function fuzzy(
  query: string,
  items: CountryDataItemShort[],
): CountryDataItemShort[] {
  return items
    .map((item) => {
      return {
        data: item,
        rating: stringSimilarity(query, item.name.common),
      };
    })
    .filter((item) => item.rating >= SIMILARITY_THRESHOLD)
    .sort((a, b) => {
      return b.rating - a.rating;
    })
    .map((item) => item.data);
}
