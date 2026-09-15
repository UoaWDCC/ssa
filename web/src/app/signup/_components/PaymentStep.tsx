import Button from '@/components/Button'

export default function PaymentStep({
  onPay,
  onBack,
  isLoading,
}: {
  onPay: () => void
  onBack: () => void
  isLoading: boolean
}) {
  return (
    <div
      className="
        grid gap-6 pt-2 
        [grid-template-areas:'content'_'card'_'button']
        md:grid-cols-2 md:grid-rows-[1fr_auto]
        md:[grid-template-areas:'content_card'_'button_card']
      "
    >
      <div className="flex flex-col gap-4 [grid-area:content]">
        <p className="text-ssa-grey">Complete your SSA Membership!</p>
        <ul className="list-disc list-inside text-ssa-overlay-grey space-y-1 ml-1">
          <li>Get goodies & discounts from SSA sponsors...</li>
          <li>Become part of our community...</li>
          <li>
            Meet other fellow students and make memories throughout the year...
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-5 p-6 bg-ssa-cream rounded-2xl sm:min-h-60 min-h-40 [grid-area:card]">
        <label className="text-xs font-normal text-ssa-muted-taupe font-dm-mono">
          ORDER SUMMARY
        </label>
        <div className="flex items-center justify-between text-ssa-grey">
          <p className="text-md font-inter">SSA Membership</p>
          <p className="text-md font-inter">$6.00</p>
        </div>
        <hr className="border-ssa-grey/10 border" />
        <Button
          onClick={onPay}
          disabled={isLoading}
          arrow={false}
          className="w-full rounded-[42px] tracking-wide mt-auto font-be-vietnam-pro bg-ssa-red font-semibold text-ssa-white text-sm transition-opacity disabled:opacity-60"
        >
          {isLoading ? 'PROCESSING...' : 'PAY $6'}
        </Button>
      </div>
      <Button
        onClick={onBack}
        size="short"
        variant="outline"
        color="grey"
        arrow={true}
        arrowSide="left"
        className="w-full justify-center md:w-fit self-end [grid-area:button] text-sm!"
      >
        BACK
      </Button>
    </div>
  )
}
