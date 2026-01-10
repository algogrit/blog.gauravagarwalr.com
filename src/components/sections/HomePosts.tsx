import { useMemo } from "react";

import LatestPosts from "../posts/LatestPosts";
import { TagFilter } from "../tags/TagFilter";

import type { PostWithRT } from "../../data/posts/interface";

import useQueryParams from "../helpers/useQueryParams";
import setQueryParam from "../helpers/setQueryParam";

export default function HomePosts({ posts, tags }: { posts: PostWithRT[], tags: string[] }) {
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

  return (
    <>
      <TagFilter
        tags={tags}
        selectedTag={selectedTag}
        onTagSelect={(tag: string | null) => setQueryParam("tag", tag)}
      />

      <LatestPosts posts={filteredPosts} />
    </>
  );
};
