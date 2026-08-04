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
      className="flex h-[58px] w-[195px] shrink-0 items-center justify-center rounded-full bg-ssa-salmon font-be-vietnam-pro text-[20px] font-semibold uppercase leading-none text-white transition-opacity hover:opacity-90 cursor-pointer"
    >
      View More
    </button>
  )
}
