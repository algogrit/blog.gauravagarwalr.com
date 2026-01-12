import DropdownOption from "./DropdownOption";

interface DropdownProps {
  tags: string[],
  selectedTag: string | null,
  onTagSelect: (tag: string | null) => void
}

export default function Dropdown({ tags, selectedTag, onTagSelect }: DropdownProps) {
  return (
    <select
      value={selectedTag ?? ""}
      onChange={(e) => {
        const value = e.target.value
        onTagSelect(value === "" ? null : value)
      }}
      className="border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-accent px-4 py-2 text-sm">
        <option value="">All Posts</option>

        {tags.map((tag) => <DropdownOption tag={tag} key={tag}/>)}
    </select>
  );
}
