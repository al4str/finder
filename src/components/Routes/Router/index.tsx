import { BrowserHistory } from 'history';
import { ReactNode, useRef, useState, useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { navigationGetHistory } from '@/helpers/navigation';

interface Props {
  children: ReactNode,
}

export function RoutesRouter(props: Props): JSX.Element {
  const { children } = props;
  const historyRef = useRef<BrowserHistory>(navigationGetHistory());
  const history = historyRef.current;
  const { action, location } = history;
  const [state, setState] = useState({ action, location });

  useLayoutEffect(() => {
    history.listen(setState);
  }, [history]);

  return (
    <Router
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </Router>
  );
}
