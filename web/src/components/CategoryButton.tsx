import { FaCheck, FaPlus } from 'react-icons/fa6'

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
      className={`inline-flex h-[43px] items-center justify-center gap-2 rounded-lg px-4 font-be-vietnam-pro text-base font-semibold uppercase tracking-[-0.02em] shadow-[0_0_2.5px_rgba(255,255,255,0.25)] transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8392] focus-visible:ring-offset-2 ${
        showPlusIcon ? '' : 'w-16'
      } ${
        isActive
          ? 'bg-[#FF8392] text-[#FFFBF4]'
          : 'bg-ssa-cream text-ssa-grey hover:bg-[#FF8392] hover:text-[#FFFBF4]'
      }`}
    >
      {showPlusIcon &&
        (isActive ? (
          <FaCheck className="size-[15px] shrink-0" aria-hidden="true" />
        ) : (
          <FaPlus className="size-[15px] shrink-0" aria-hidden="true" />
        ))}
      {label}
    </button>
  )
}
