import type { CollectionEntry } from "astro:content";
import { getReadingTime } from "../getReadingTime";
import type { PostWithRT } from "./interface";

export default function addReadingTime(posts: CollectionEntry<"posts">[] ): PostWithRT[] {
  return posts.map((post) => ({
    ...post,
    readingTime: getReadingTime(post.body),
  }));
}
