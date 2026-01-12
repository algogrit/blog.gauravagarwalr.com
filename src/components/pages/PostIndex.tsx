import { useMemo } from "react";

import SearchAndTags from "../tags/SearchAndTags";

// import PostsNewsletter from "../cta/PostsNewsletter";
import type { PostWithRT } from "../../data/posts/interface";

import setQueryParam from "../helpers/setQueryParam";
import useQueryParams from "../helpers/useQueryParams";

export default function PostIndex({ posts }: { posts: PostWithRT[] }) {
  const query = useQueryParams();
  const selectedTag = query.get("tag");
  const searchQuery = query.get("q");

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        // Filter by tag
        if (selectedTag && !post.data.tags.includes(selectedTag)) {
          return false;
        }
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            post.data.title.toLowerCase().includes(query) ||
            post.data.excerpt.toLowerCase().includes(query) ||
            post.data.tags.some((tag) => tag.toLowerCase().includes(query)) ||
            (post.body && post.body.toLowerCase().includes(query))
          );
        }
        return true;
      }).sort(
        (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
      );
  }, [selectedTag, searchQuery]);

  const tagCounts = posts
    .flatMap(post => post.data.tags)
    .reduce((acc: any, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  const allTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  return (
    <>
      <SearchAndTags
        tags={allTags}
        selectedTag={selectedTag}
        onTagSelect={(tag: string | null) => setQueryParam("tag", tag)}
      />
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {
          (filteredPosts.length > 0) &&
          <ul className="divide-y">
            {filteredPosts.map((post) => (
              <li className="py-8 hover:border-amber-400 border transition rounded-lg px-4 border-white dark:border-gray-900 border-t-amber-100 dark:border-t-gray-800" key={post.id}>
                <a href={"/posts/"+post.id}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">
                        {post.data.title}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        {post.data.excerpt}
                      </p>
                    </div>
                    <div className="flex gap-4 text-xs text-slate-500 dark:text-gray-300">
                      <span>{post.data.tags[0].split("-").join(' ')}</span>
                      <span>{post.readingTime.minutes} min</span>
                      <span>{post.data.date.getFullYear()}</span>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        }
        {
          (filteredPosts.length == 0) &&
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

      </main>

      {/* <PostsNewsletter/> */}
    </>
  );
};
