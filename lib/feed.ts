import { Feed } from 'feed';
import { getAllPosts } from './posts';

export function generateRSSFeed() {
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.algogrit.com';
  const date = new Date();

  const feed = new Feed({
    title: "Gaurav's Blog",
    description: "Technical writing and engineering insights",
    id: siteURL,
    link: siteURL,
    language: "en",
    image: `${siteURL}/logo.png`,
    favicon: `${siteURL}/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}, Gaurav Agarwal`,
    updated: date,
    feedLinks: {
      rss2: `${siteURL}/api/feed`,
      json: `${siteURL}/api/feed/json`,
      atom: `${siteURL}/api/feed/atom`,
    },
    author: {
      name: "Gaurav Agarwal",
      link: "https://algogrit.com",
    },
  });

  const posts = getAllPosts();

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteURL}/posts/${post.slug}`,
      link: `${siteURL}/posts/${post.slug}`,
      description: post.excerpt,
      content: post.content,
      date: new Date(post.date),
      category: post.tags.map(tag => ({ name: tag })),
    });
  });

  return feed;
}
