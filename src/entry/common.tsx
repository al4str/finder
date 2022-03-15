import { StrictMode } from 'react';
import { render } from 'react-dom';
import '@/styles/index.css';
import { App } from '@/components/App';

export function appInit(): void {
  const appRoot = window.document.getElementById('root');

  render((
    <StrictMode>
      <App />
    </StrictMode>
  ), appRoot);
}
