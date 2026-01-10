import type { CollectionEntry } from 'astro:content';
import type { ReadingTime } from '../getReadingTime';

export type PostWithRT =
  CollectionEntry<'posts'> & {
    readingTime: ReadingTime;
  };
