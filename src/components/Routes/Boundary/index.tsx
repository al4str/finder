import { Component } from 'react';
import { exceptionsCapture } from '@/utils/exceptions';
import { RoutesErrorType, RoutesFallback } from '@/components/Routes/Fallback';

interface Props {
  withLink?: boolean;
}

interface State {
  errorType: null | RoutesErrorType;
}

export class RoutesBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return {
      errorType: getErrorType(error),
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      errorType: null,
    };
  }
  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error: Error, errorInfo: unknown) {
    exceptionsCapture(error);
    // eslint-disable-next-line no-console
    console.dir(errorInfo);
  }
  render(): JSX.Element {
    const { withLink = false, children } = this.props;
    const { errorType } = this.state;

    if (errorType) {
      return (
        <RoutesFallback
          withLink={withLink}
          errorType={errorType}
        />
      );
    }
    return <>{children}</>;
  }
}

function getErrorType(error: Error): RoutesErrorType {
  if (!window.navigator.onLine) {
    return 'OFFLINE';
  }
  if (error.toString().includes('ChunkLoadError')) {
    return 'CHUNK_LOADING';
  }
  return 'RUNTIME';
}
