import setQueryParam from "../helpers/setQueryParam";
import Dropdown from "./Dropdown";
import TagButton from "./TagButton";

interface SearchAndTagsProps {
  tags: string[];
  selectedTag?: string;
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
          className="w-full md:w-96 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-accent"
        />

        <Dropdown tags={tags} selectedTag={selectedTag} onTagSelect={onTagSelect}/>
      </div>
    </section>
  );
}
