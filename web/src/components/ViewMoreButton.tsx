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
      className="px-8 py-3 rounded-full bg-ssa-skin-yellow text-ssa-light-brown font-averia font-bold border-[3px] border-ssa-dark-skin-yellow hover:bg-ssa-dark-skin-yellow hover:border-transparent transition-colors duration-300"
    >
      View More →
    </button>
  )
}
