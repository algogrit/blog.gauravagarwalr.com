import { generateRSSFeed } from '@/lib/feed';

export async function GET() {
  const feed = generateRSSFeed();

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  });
}
