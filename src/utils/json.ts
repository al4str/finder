import { exceptionsCapture } from '@/utils/exceptions';

export function jsonSafeParse<T>(
  text: string,
  fallback: T,
): T {
  try {
    return JSON.parse(text);
  }
  catch (err) {
    return fallback;
  }
}

export function jsonSafeStringify(data: unknown): string {
  try {
    return JSON.stringify(data);
  }
  catch (err) {
    if (err instanceof Error) {
      exceptionsCapture(err);
    }
    return '';
  }
}
