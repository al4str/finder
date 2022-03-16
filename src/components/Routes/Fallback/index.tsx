import clsx from 'clsx';

export type RoutesErrorType = 'OFFLINE' | 'CHUNK_LOADING' | 'RUNTIME';

interface Props {
  className?: string;
  withLink: boolean;
  errorType: RoutesErrorType;
}

export function RoutesFallback(props: Props): JSX.Element {
  const {
    className = '',
    withLink,
    errorType,
  } = props;
  const { title, message } = getTitleMessage(errorType);
  const showMessage = Boolean(message);

  if (!errorType) {
    return <></>;
  }
  return (
    <div className={clsx('', className)}>
      <div className="">
        <h1 className="">
          {title}
        </h1>
        {showMessage && <p className="">{message}</p>}
        {withLink
        && <a
          className={clsx('')}
          href={window.location.href}
        >
          <span className="">
            <span className="">
              Please, reload the page
            </span>
          </span>
        </a>}
      </div>
    </div>
  );
}

function getTitleMessage(errorType: RoutesErrorType): { title: string; message: string } {
  switch (errorType) {
    case 'OFFLINE':
      return {
        title: 'You are offline 🔴',
        message: 'Your device seems to be offline or using slow internet connection or "lie-fi"',
      };
    case 'CHUNK_LOADING':
      return {
        title: 'Application might be stale 🏚',
        message: 'You tried navigating to/loading a page/resource, that is no longer available',
      };
    case 'RUNTIME':
    default:
      return {
        title: 'Something went wrong 😢',
        message: '',
      };
  }
}
