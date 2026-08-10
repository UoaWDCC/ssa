export default function PaymentStep({
  onPay,
  isLoading,
}: {
  onPay: () => void
  isLoading: boolean
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h2 className=" text-ssa-grey">Complete your SSA Membership!</h2>
        <ul className="list-disc list-inside text-md text-ssa-overlay-grey space-y-1 ml-1">
          <li>Get goodies & discounts from SSA sponsors...</li>
          <li>Become part of our community...</li>
          <li>
            Meet other fellow students and make memories throughout the year...
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-5 p-6 bg-ssa-cream rounded-2xl sm:min-h-80 min-h-40">
        <label className="text-xs font-normal text-ssa-muted-taupe font-dm-mono">
          Order Summary
        </label>
        <div className="flex items-center justify-between text-ssa-grey">
          <p className="text-md font-inter">SSA Membership</p>
          <p className="text-md font-inter">$6.00</p>
        </div>
        <hr className="border-ssa-grey/10 border" />
        <button
          onClick={onPay}
          disabled={isLoading}
          className="w-full py-3 rounded-[5px] mt-auto bg-stripe-purple font-bold text-ssa-white text-sm transition-opacity disabled:opacity-60"
        >
          {isLoading ? 'Processing...' : 'Pay $6'}
        </button>
        <p className="mx-auto text-sm text-stripe-purple  rounded-md px-3 py-1.5">
          Powered by Stripe
        </p>
      </div>
    </div>
  )
}
