import { ReactNode, Suspense } from 'react';
import { Header } from '@/components/Header';

interface Props {
  children: ReactNode;
}

export function LayoutsDefault(props: Props): JSX.Element {
  const { children } = props;

  return (
    <>
      <div className="relative z-app">
        <Header className="relative z-app-header py-1 px-2" />
        <main className="relative z-app-main pt-1 px-2 pb-4">
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </main>
      </div>
    </>
  );
}
