import {images} from '../assets';
import type {Wallpaper} from '../types/app';

const sources = [
  images.wallpaper01,
  images.wallpaper02,
  images.wallpaper03,
  images.wallpaper04,
  images.wallpaper05,
  images.wallpaper06,
  images.wallpaper07,
];

export const wallpapers: Wallpaper[] = Array.from({length: 15}, (_, index) => ({
  id: `wallpaper-${index + 1}`,
  source: sources[index % sources.length],
  cost: 6,
}));
