interface ViewMoreButtonProps {
  onClick: () => void
  hasMore: boolean
}

export default function ViewMoreButton({
  onClick,
  hasMore,
}: ViewMoreButtonProps) {
  if (!hasMore) return null

  return (
    <button
      onClick={onClick}
      className="px-6 py-2 text-sm md:px-8 md:py-3 md:text-base rounded-full bg-ssa-skin-yellow text-ssa-category-text font-averia font-bold border-[3px] border-ssa-dark-skin-yellow hover:bg-ssa-dark-skin-yellow hover:border-transparent transition-colors duration-300"
    >
      View More →
    </button>
  )
}
