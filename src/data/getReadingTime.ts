import readingTime from 'reading-time';

export type ReadingTime = {
  minutes: number;
  text: string;
  words: number;
  time: number;
};

const DUMMY_READING_TIME: ReadingTime = {
  minutes: 1,
  text: '1 min read',
  words: 0,
  time: 0,
};

export function getReadingTime(markdown?: string): ReadingTime {
  if (!markdown || markdown.trim().length === 0) {
    return DUMMY_READING_TIME;
  }

  const stats = readingTime(markdown);

  return {
    minutes: Math.ceil(stats.minutes),
    text: stats.text,          // e.g. "4 min read"
    words: stats.words,        // total word count
    time: stats.time,          // milliseconds
  };
}
