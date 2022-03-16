import { IS_PRODUCTION } from '@/constants';

export function exceptionsInit(): void {
  window.onerror = (_message, _url, _line, _column, error) => {
    if (error) {
      exceptionsCapture(error);
    }
  };
  if ('onunhandledrejection' in window) {
    window.onunhandledrejection = (event) => {
      const reason = event.reason.toString();
      if (typeof reason === 'string') {
        exceptionsCapture(new Error(reason));
      }
      else {
        log(event);
      }
    };
  }
}

export function exceptionsCapture(err: Error): void {
  log(err);
}

function log(err: string | Error | { toString: () => string }): void {
  if (!IS_PRODUCTION) {
    console.error(err);
    return;
  }
  if (typeof err === 'string') {
    // eslint-disable-next-line no-console
    console.info(err);
  }
  if (typeof err?.toString === 'function') {
    // eslint-disable-next-line no-console
    console.info(err.toString());
  }
}
