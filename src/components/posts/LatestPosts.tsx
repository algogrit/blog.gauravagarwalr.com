import type { CollectionEntry } from "astro:content";
import PostCard from "./PostCard";

export default function LatestPosts({posts}: {posts: CollectionEntry<"posts">[]}) {
  return (
    <section id="latest-articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-linear-to-r from-orange-500 to-yellow-500 rounded mr-3"></div>
            <h2 className="text-3xl font-bold">Latest Articles</h2>
        </div>
        <a href="/posts" className="text-orange-500 dark:text-orange-400 font-semibold hover:underline">View All →</a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.splice(0, 8).map(post => (
            <PostCard post={post} key={post.id}/>
        ))}
      </div>
    </section>
  );
}
