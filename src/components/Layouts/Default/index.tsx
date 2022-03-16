import { ReactNode, Suspense } from 'react';
import { Header } from '@/components/Header';
import { Map } from '@/components/Map';

interface Props {
  children: ReactNode;
}

export function LayoutsDefault(props: Props): JSX.Element {
  const { children } = props;

  return (
    <>
      <div className="relative z-app flex flex-col h-full">
        <Map className="z-app-map w-full min-h-[200px] h-[50vh]" />
        <Header className="absolute z-app-header top-0 left-0 w-full py-2 px-3 backdrop-blur-sm bg-white/30 dark:bg-zinc-900/50" />
        <main className="relative z-app-main flex-grow px-3 pb-4 background">
          <span className="absolute -top-8 left-0 w-full h-8 rounded-t-[2rem] background" />
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </main>
      </div>
    </>
  );
}
