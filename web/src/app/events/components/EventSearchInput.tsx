interface EventSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const searchInputClassName = [
  'h-10 w-full rounded-full border border-ssa-pink-light bg-white',
  'px-4 py-1.5 font-averia text-base text-ssa-grey',
  'placeholder:text-ssa-pink-light',
  'focus:border-ssa-red focus:outline-none',
  'md:h-14 md:max-w-[1215px] md:px-5 md:text-xl',
].join(' ')

export default function EventSearchInput({
  value,
  onChange,
  placeholder = 'Search events...',
}: EventSearchInputProps) {
  return (
    <input
      type="search"
      aria-label="Search events"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={searchInputClassName}
    />
  )
}
