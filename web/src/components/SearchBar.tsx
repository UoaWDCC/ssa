interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search',
  ariaLabel = 'Search',
}: Readonly<SearchBarProps>) {
  return (
    <label className="flex h-11 w-full items-center rounded-[26.67px] border-[0.8px] border-[#434242]/30 bg-white pl-[21px] pr-[19px] transition-colors duration-[180ms] ease-out focus-within:border-[#ff8392]">
      <span className="sr-only">{ariaLabel}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent font-inter text-xs font-normal leading-4 tracking-[-0.2px] text-ssa-grey/50 outline-none placeholder:text-ssa-grey/50 [&::-webkit-search-cancel-button]:appearance-none"
      />
    </label>
  )
}
