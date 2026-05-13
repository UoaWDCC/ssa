import EventCategoryButton from './EventCategoryButton'

interface EventCategoryFiltersProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export default function EventCategoryFilters({
  categories,
  selectedCategory,
  onSelectCategory,
}: EventCategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <EventCategoryButton
          key={category}
          category={category}
          isSelected={selectedCategory === category}
          onClick={() => onSelectCategory(category)}
        />
      ))}
    </div>
  )
}
