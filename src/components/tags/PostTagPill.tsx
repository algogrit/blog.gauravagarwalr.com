export default function PostTagPill({tag}: {tag: string}) {
  let tagLabel = tag.split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

  return (
    <span className="px-3 py-1 bg-orange-500/10 text-orange-500 dark:text-orange-400 rounded-full text-sm font-medium">
      {tagLabel}
    </span>
  );
}
