import { createApi } from 'unsplash-js';
import { PhotoDataItem, PhotoDataItemShort } from '@/types/photos';
import { KEY_UNSPLASH } from '@/constants';
import { storeCreate } from '@/utils/store';
import { exceptionsCapture } from '@/utils/exceptions';
import { localStorageGet, localStorageSet } from '@/hooks/localStorage';

const STORAGE_KEY = 'FINDER_PHOTOS';

const STORAGE_FALLBACK: PhotosEntries = {};

const PHOTOS_AMOUNT = 5;

const API = createApi({
  accessKey: KEY_UNSPLASH,
});

type Action = 'SET_PHOTOS';

interface State {
  photos: Map<string, PhotoDataItemShort[]>
}

const initialState: State = {
  photos: new Map(),
};

const {
  getState,
  dispatch,
  useStore,
} = storeCreate<State, Action>(
  initialState,
  reducer,
);

export function usePhotosStore() {
  useStore();

  return getState();
}

export function photosInit() {
  const entriesObject = readFromStorage();
  dispatch('SET_PHOTOS', {
    photos: new Map(Object.entries(entriesObject)),
  });
}

export async function photosFetch(name: string) {
  if (!name) {
    return;
  }
  const { photos } = getState();
  const items = photos.get(name);
  if (items && items.length > 0) {
    return;
  }
  const nextItems = await fetch(name);
  const nextPhotos = new Map(photos);
  const mappedItems = nextItems.map((item) => {
    return mapPhotoItem(name, item);
  });
  nextPhotos.set(name, mappedItems);
  dispatch('SET_PHOTOS', {
    photos: nextPhotos,
  });
  saveToStorage();
}

async function fetch(name: string): Promise<PhotoDataItem[]> {
  try {
    const res = await API.search.getPhotos({
      query: name,
      orientation: 'landscape',
      page: 0,
      perPage: PHOTOS_AMOUNT,
    });
    return res.response?.results || [];
  }
  catch (err) {
    if (err instanceof Error) {
      exceptionsCapture(err);
    }
    return [];
  }
}

function mapPhotoItem(name: string, item: PhotoDataItem): PhotoDataItemShort {
  return {
    name,
    url: item.urls.regular,
    user: item.user.username,
  };
}

interface PhotosEntries {
  [name: string]: PhotoDataItemShort[];
}

function saveToStorage() {
  const { photos } = getState();
  const value = Object.fromEntries(Array.from(photos.entries()));
  localStorageSet<PhotosEntries>(STORAGE_KEY, value);
}

function readFromStorage(): PhotosEntries {
  return localStorageGet<PhotosEntries>(STORAGE_KEY, STORAGE_FALLBACK);
}

function reducer(
  state: State,
  action: { type: Action; payload: State },
): State {
  switch (action.type) {
    case 'SET_PHOTOS':
      return {
        ...state,
        photos: action.payload.photos,
      };
    default:
      return state;
  }
}
