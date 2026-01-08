import type { CollectionEntry } from "astro:content";
import { useMemo, useState } from "react";
// import { useSearchParams } from "react-router-dom";
import { TagFilter } from "./TagFilter";
import FeaturedPost from "./FeaturedPost";
import PostCard from "./PostCard";

const HomePosts = ({
  posts,
}: {
  posts: CollectionEntry<"posts">[];
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // const selectedTag = searchParams.get("tag");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagSelect = (tag: string | null) => {
    console.log(tag);
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
  // const allTags = [...new Set(posts.flatMap(post => post.data.tags))];

  // const [selectedTag, setSelectedTag] = useState('');

  const tagCounts = posts
    .flatMap(post => post.data.tags)
    .reduce((acc: any, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  const allTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  console.log(allTags);

  // if selectedTag == '' {
  //   filteredPosts =
  // }

  return (
    <>
      <TagFilter
        tags={allTags}
        selectedTag={selectedTag}
        onTagSelect={handleTagSelect}
      />

      <FeaturedPost post={featuredPost}/>

      <section id="posts" className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold mb-10">Latest Articles</h2>

        {filteredPosts.splice(0, 5).map(post => (
            <PostCard post={post}/>
        ))}
      </section>
    </>
  );


};


export default HomePosts;
