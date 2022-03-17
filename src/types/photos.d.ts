import { Basic } from 'unsplash-js/dist/index';

export type PhotoDataItem = Basic;

export interface PhotoDataItemShort {
  name: string;
  url: Basic['urls']['regular'];
  user: Basic['user']['username'];
}
