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
      className="px-8 py-3 rounded-full bg-ssa-yellow text-[#968055] font-averia font-bold hover:bg-ssa-red hover:text-ssa-yellow transition-colors duration-300"
    >
      View More →
    </button>
  )
}
