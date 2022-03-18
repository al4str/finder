import { ReactNode, Suspense } from 'react';
import { Header } from '@/components/Header';
import { Map } from '@/components/Map';

interface Props {
  children: ReactNode;
}

export function LayoutsDefault(props: Props): JSX.Element {
  const { children } = props;

  return (
    <div className="relative z-app flex flex-col min-h-screen-true sm:text-lg">
      <Map className="fixed z-app-map top-0 left-0 w-full h-full" />
      <Header className="sticky z-app-header top-0 w-full" />
      <div
        className="relative z-app-space w-full h-[50vw] min-h-[200px] shrink-0 pointer-events-none sm:h-[40vh] md:h-[35vh] lg:h[30vh]"
        id="space"
      >
        <div className="flex items-center justify-center w-full h-full">
          <p className="message">Preparing map..</p>
        </div>
      </div>
      <main className="relative z-app-main mt-auto mb-3 sm:mb-5 md:mx-auto md:w-[700px]">
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
