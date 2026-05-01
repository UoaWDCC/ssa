import { TOTAL_STEPS } from './types'

export default function ProgressBar({ step }: { step: number }) {
  const progress = (step / TOTAL_STEPS) * 100
  return (
    <div
      className="w-full h-3 rounded-full overflow-hidden"
      style={{ backgroundColor: '#ffb3bf' }}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${progress}%`, backgroundColor: '#f85b76' }}
      />
    </div>
  )
}
