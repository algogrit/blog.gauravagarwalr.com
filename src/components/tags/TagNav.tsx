import TagButton from "./TagButton";

interface TagFilterProps {
  tags: string[];
}

export default function TagNav({ tags }: TagFilterProps) {
  return (
    <section className="bg-amber-50 border-y border-amber-200 dark:border-gray-800 dark:bg-gray-900/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-1 w-12 bg-linear-to-r from-orange-500 to-yellow-500 rounded mr-3"></div>
          <h2 className="text-3xl font-bold">Browse by Tag</h2>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-wrap justify-center gap-3">
          <TagButton key="all-posts" tag="All Posts" isSelected={true}/>
          {tags.map((tag) => (
            <TagButton key={tag} tag={tag} isFiltering={true} isSelected={false}/>
          ))}
        </div>
      </div>
    </section>
  );
};
