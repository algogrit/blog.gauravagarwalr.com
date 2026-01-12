import { cn } from "../../lib/utils";
import safeURL from "../helpers/safeURL";

interface TagButtonProps { tag: string, isSelected: boolean };

export default function TagButton({tag, isSelected}: TagButtonProps) {
  let buttonClass = cn(
    "px-5 py-2 rounded-full cursor-pointer",
    isSelected ?
      "bg-amber-500 border border-amber-500 text-white" :
      "border border-amber-300 bg-white dark:bg-gray-900 dark:border-gray-800 hover:bg-amber-500 hover:text-white transition"
  );

    let tagLabel = tag.split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');


  return (
    <a href={safeURL("/posts", {"tag": tag})}>
      <button className={buttonClass}>
        {tagLabel}
      </button>
    </a>
  );
}
