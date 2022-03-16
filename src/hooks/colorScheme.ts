import { storeCreate } from '@/utils/store';
import { localStorageSet, localStorageGet } from '@/hooks/localStorage';

const STORAGE_KEY = 'FINDER_COLOR_SCHEME';

export type ColorScheme = 'dark' | 'light' | 'system';

export type ColorSchemeActual = Exclude<ColorScheme, 'system'>;

export interface ColorSchemeState {
  /** Color scheme that user selected (or system defined) */
  selected: ColorScheme;
  /** Actual color scheme that is applied right now */
  actual: ColorSchemeActual;
}

const MEDIA_QUERY = window.matchMedia('(prefers-color-scheme: dark)');

const initialState: ColorSchemeState = {
  selected: getStorageScheme(),
  actual: getActualScheme(),
};

type ActionType = 'UPDATE';

const {
  getState,
  dispatch,
  useStore,
} = storeCreate<ColorSchemeState,
  ActionType>(initialState, reducer);

export const colorSchemeGetState = getState;

export function colorSchemeApply(scheme: ColorScheme): void {
  if (scheme === 'dark'
    || (scheme === 'system' && getSystemScheme() === 'dark')) {
    applyDarkMode(scheme);
    return;
  }
  applyLightMode(scheme);
}

export function useColorScheme(): ColorSchemeState {
  useStore();

  return colorSchemeGetState();
}

function applyDarkMode(scheme: Extract<ColorScheme, 'dark' | 'system'>) {
  window.document.documentElement.classList.add('dark');
  window.document.documentElement.style.setProperty(
    'color-scheme',
    'dark light',
  );
  saveStorageScheme('dark');
  dispatch('UPDATE', {
    selected: scheme,
    actual: 'dark',
  });
}

function applyLightMode(scheme: Extract<ColorScheme, 'light' | 'system'>) {
  window.document.documentElement.classList.remove('dark');
  window.document.documentElement.style.setProperty('color-scheme', '');
  saveStorageScheme('light');
  dispatch('UPDATE', {
    selected: scheme,
    actual: 'light',
  });
}

function getActualScheme(): ColorSchemeActual {
  return window.document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light';
}

function saveStorageScheme(scheme: ColorScheme): void {
  localStorageSet(STORAGE_KEY, scheme);
}

function getStorageScheme(): ColorScheme {
  return localStorageGet<ColorScheme>(STORAGE_KEY, 'system');
}

function getSystemScheme(): ColorSchemeActual {
  return MEDIA_QUERY.matches
    ? 'dark'
    : 'light';
}

MEDIA_QUERY.addEventListener('change', () => {
  if (getStorageScheme() === 'system') {
    colorSchemeApply(getSystemScheme());
  }
});

function reducer(
  prevState: ColorSchemeState,
  action: { type: ActionType; payload: ColorSchemeState },
): ColorSchemeState {
  switch (action.type) {
    case 'UPDATE':
      return {
        ...prevState,
        ...action.payload,
      };
    default:
      return prevState;
  }
}
