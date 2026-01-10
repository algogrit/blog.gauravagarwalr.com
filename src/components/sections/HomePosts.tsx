// TODO: Get the search working
import { useMemo, useState } from "react";
// import { useSearchParams } from "react-router-dom";
import FeaturedPost from "../posts/FeaturedPost";
import LatestPosts from "../posts/LatestPosts";
import { TagFilter } from "../tags/TagFilter";
import type { PostWithRT } from "../../data/posts/interface";

const HomePosts = ({
  posts,
}: {
  posts: PostWithRT[];
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagSelect = (tag: string | null) => {
    if (tag) {
      setSelectedTag(tag);
    } else {
      setSelectedTag(null);
    }
  };

  const featuredPost = posts.find((post) => post.data.featured);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => !post.data.featured)
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
      <FeaturedPost post={featuredPost}/>

      <TagFilter
        tags={allTags}
        selectedTag={selectedTag}
        onTagSelect={handleTagSelect}
      />

      <LatestPosts posts={filteredPosts}/>
    </>
  );
};


export default HomePosts;
