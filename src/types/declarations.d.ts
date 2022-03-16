declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    BUILD_MODERNITY: 'modern' | 'legacy';
    DEPLOY_ENV: 'local' | 'development' | 'production';
    SECRETS_KEY_MAPTILER: string;
  }
}

declare interface Window {
  __INJECTABLE_ASSETS__: Record<string, string>;
  __INJECTABLE_CHUNKS__: Record<string, string[]>;
}

declare module '*.svg' {
  import { SVGProps } from 'react';

  const SVGComponent: (props: SVGProps<SVGSVGElement>) => JSX.Element;

  export default SVGComponent;
}

declare module '*.css' {
  const classes: { [key: string]: string };

  export default classes;
}

declare module 'jaro-winkler' {
  const calculateSimilarity = (a: string, b: string) => number;

  export default calculateSimilarity;
}
