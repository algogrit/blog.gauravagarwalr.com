export default function DropdownOption({ tag }: { tag: string }) {
  let tagLabel = tag.split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

  return (
    <option value={tag}>
      {tagLabel}
    </option>
  )
}
