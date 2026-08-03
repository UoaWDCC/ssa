import { FaPlus } from 'react-icons/fa6'

interface CategoryButtonProps {
  label: string
  isActive: boolean
  showPlusIcon?: boolean
  onClick: () => void
}

export default function CategoryButton({
  label,
  isActive,
  showPlusIcon = true,
  onClick,
}: Readonly<CategoryButtonProps>) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`inline-flex h-[43px] items-center justify-center gap-2 rounded-lg px-4 font-be-vietnam-pro text-base font-semibold uppercase tracking-[-0.02em] transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ssa-red focus-visible:ring-offset-2 ${
        showPlusIcon ? '' : 'w-16'
      } ${
        isActive
          ? 'bg-ssa-red text-white'
          : 'bg-cream text-grey hover:bg-ssa-red hover:text-white'
      }`}
    >
      {showPlusIcon && (
        <FaPlus className="size-[15px] shrink-0" aria-hidden="true" />
      )}
      {label}
    </button>
  )
}
