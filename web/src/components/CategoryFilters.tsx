import CategoryButton from './CategoryButton'

interface CategoryFiltersProps<T extends string> {
  options: readonly T[]
  selectedOption: T
  onChange: (option: T) => void
  ariaLabel: string
  iconlessOption?: T
  className?: string
}

export default function CategoryFilters<T extends string>({
  options,
  selectedOption,
  onChange,
  ariaLabel,
  iconlessOption,
  className = '',
}: Readonly<CategoryFiltersProps<T>>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`flex flex-wrap gap-4 ${className}`}
    >
      {options.map((option) => (
        <CategoryButton
          key={option}
          label={option}
          isActive={selectedOption === option}
          showPlusIcon={option !== iconlessOption}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  )
}
