import PostCard from "./PostCard";
import type { PostWithRT } from "../../data/posts/interface";
import HomeSearch from "../tags/HomeSearch";

export default function LatestPosts({posts}: {posts: PostWithRT[]}) {
  return (
    <section id="latest-articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-linear-to-r from-orange-500 to-yellow-500 rounded mr-3"></div>
            <h2 className="text-3xl font-bold">Latest Articles</h2>
        </div>
        <a href="/posts" className="text-orange-500 dark:text-orange-400 font-semibold hover:underline">View All →</a>
      </div>

      <HomeSearch/>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.splice(0, 8).map(post => (
            <PostCard post={post} key={post.id}/>
        ))}
      </div>

      {
        (posts.length == 0) &&
        <div id="empty-state" className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No posts found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
        </div>
      }
    </section>
  );
}
