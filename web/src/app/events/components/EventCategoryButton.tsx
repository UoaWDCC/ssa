interface EventCategoryButtonProps {
  category: string
  isSelected: boolean
  onClick: () => void
}

const categoryButtonBaseClassName = [
  // TODO: Review these Figma-derived category pill values
  // (text-[10px], md:text-[25px], md:min-h-[62px]) with the design team.
  'rounded-full border-2 px-3 py-1 font-averia text-[10px] font-bold',
  'transition-colors duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ssa-red',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-ssa-yellow-light',
  'md:min-h-[62px] md:px-8 md:text-[25px]',
].join(' ')

const categoryButtonVariantClassName = {
  selected: 'border-transparent bg-ssa-red text-ssa-yellow',
  unselected:
    'border-transparent bg-ssa-yellow text-ssa-category-text hover:bg-ssa-red hover:text-ssa-yellow',
}

export default function EventCategoryButton({
  category,
  isSelected,
  onClick,
}: EventCategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${categoryButtonBaseClassName} ${
        isSelected
          ? categoryButtonVariantClassName.selected
          : categoryButtonVariantClassName.unselected
      }`}
    >
      {category}
    </button>
  )
}
