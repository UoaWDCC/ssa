export default function ProgressBar({
  step,
  total,
}: {
  step: number
  total: number
}) {
  const progress = (step / total) * 100
  return (
    <div
      className="w-full h-3 rounded-full overflow-hidden bg-ssa-red-lighter"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label={`Step ${step} of ${total}`}
    >
      <div
        className="h-full rounded-full transition-all duration-300 bg-ssa-red"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
