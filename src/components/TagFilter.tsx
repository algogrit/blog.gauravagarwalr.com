import { cn } from "../lib/utils";

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export const TagFilter = ({ tags, selectedTag, onTagSelect }: TagFilterProps) => {
  return (
    <section className="bg-filter-bg border-b border-filter-border">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => onTagSelect(null)}
          className={cn(
            "tag-filter",
            selectedTag === null ? "tag-filter-active" : "tag-filter-inactive"
          )}
        >
          All Posts
        </button>
        {tags.splice(0, 7).map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={cn(
              "tag-filter",
              selectedTag === tag ? "tag-filter-active" : "tag-filter-inactive"
            )}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
};
