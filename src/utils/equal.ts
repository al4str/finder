import lodashIsEqual from 'lodash.isequal';

export function equal<T>(a: T, b: T): boolean {
  return lodashIsEqual(a, b);
}
