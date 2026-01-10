import setQueryParam from "../helpers/setQueryParam";
import TagButton from "./TagButton";

interface SearchAndTagsProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function SearchAndTags({ tags, selectedTag, onTagSelect }: SearchAndTagsProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">

        <input
          type="search"
          placeholder="Search by title, tag, or keyword…"
          onChange={(e) => setQueryParam("q", e.target.value)}
          className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:border-brand"
        />

        <div className="flex flex-wrap gap-2">
          <TagButton key="all-posts" onClick={() => onTagSelect(null)} tag="All Posts" isSelected={selectedTag === null}/>
          {tags.splice(0, 7).map((tag) => (
            <TagButton key={tag} onClick={() => onTagSelect(tag == selectedTag ? null : tag)} tag={tag} isSelected={tag == selectedTag}/>
          ))}
        </div>
      </div>
    </section>
  );
}
