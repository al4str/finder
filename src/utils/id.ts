import { nanoid } from 'nanoid';

export function idGet(size = 21): string {
  return nanoid(size);
}
