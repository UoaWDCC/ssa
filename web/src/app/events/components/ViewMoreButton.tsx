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
      className="font-be-vietnam-pro text-[16px] font-semibold uppercase leading-[24px] tracking-[-0.02em] text-[#8c8880] transition-opacity hover:opacity-70 cursor-pointer"
    >
      View More
    </button>
  )
}
