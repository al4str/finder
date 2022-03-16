import { exceptionsCapture } from '@/utils/exceptions';

interface Params<T> {
  url: string;
  options?: RequestInit;
  responseCooker?: FetchResponseCooker;
  bodyMapper?: (body: null | unknown) => T;
}

export async function fetchExec<T>(params: Params<T>): Promise<FetchResponse<T>> {
  const {
    url,
    options,
    responseCooker,
    bodyMapper,
  } = params || {};
  const mapper = typeof bodyMapper === 'function'
    ? bodyMapper
    : fetchMapBody;

  try {
    const transport = fetchTransport();
    const response = await transport(url, options);
    const rawBody = typeof responseCooker === 'function'
      ? await responseCooker(response)
      : await fetchCookResponse(response);

    if (!response.ok) {
      return {
        ok: false,
        code: response.status,
        reason: response.statusText,
        body: mapper(rawBody),
      };
    }

    return {
      ok: true,
      code: response.status,
      reason: '',
      body: mapper(rawBody),
    };
  }
  catch (err) {
    if (err instanceof Error) {
      exceptionsCapture(err);
    }

    return {
      ok: false,
      code: 520,
      reason: 'Unknown',
      body: mapper(null),
    };
  }
}

export function fetchTransport(baseUrl = ''): (path: string, options?: RequestInit) => Promise<Response> {
  return (path, options) => {
    return window.fetch(`${baseUrl}${path || '/'}`, options);
  };
}

export interface FetchResponse<T> {
  ok: boolean;
  code: number;
  reason: string;
  body: T;
}

export type FetchResponseCooker = (raw: Response) => Promise<null | Record<string, unknown>>;

async function fetchCookResponse<T = Record<string, unknown>>(raw: Response): Promise<null | T> {
  const contentType = raw.headers.get('content-type');
  const isJSON = contentType && contentType.includes('application/json');

  if (!raw.ok || !isJSON) {
    return null;
  }
  try {
    return await raw.json();
  }
  catch (err) {
    return null;
  }
}

function fetchMapBody<T>(raw: Record<string, unknown>): T {
  return raw as unknown as T;
}
