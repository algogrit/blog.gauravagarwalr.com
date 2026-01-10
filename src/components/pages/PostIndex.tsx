// TODO: Get the search working
import { useMemo, useState } from "react";
import SearchAndTags from "../tags/SearchAndTags";
import PostsNewsletter from "../cta/PostsNewsletter";
import type { PostWithRT } from "../../data/posts/interface";

export default function PostIndex({ posts }: { posts: PostWithRT[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // const selectedTag = searchParams.get("tag");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagSelect = (tag: string | null) => {
    if (tag) {
      setSelectedTag(tag);
    } else {
      setSelectedTag(null);
    }
  };

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
            post.data.tags.some((tag) => tag.toLowerCase().includes(query))
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
        onTagSelect={handleTagSelect}
      />
      <main className="max-w-5xl mx-auto px-6 pb-24">
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
      </main>

      <PostsNewsletter/>
    </>
  );
};
