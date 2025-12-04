/**
 * Centralized Storage Configuration
 */

export const STORAGE_BUCKET = 'images';

export const HERO_FILENAME_CANDIDATES = [
  'hero-firestick-breakout.jpg',
  'hero-firestick.jpg',
  'hero-image.jpg',
  'hero.jpg',
  'firestick-hero.jpg',
  'main-hero.jpg',
];

export function getBucketName(): string {
  return import.meta.env.VITE_STORAGE_BUCKET_NAME || STORAGE_BUCKET;
}
