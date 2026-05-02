import CardSection from './CardSection'

export default function PaymentStep({
  onPay,
  isLoading,
}: {
  onPay: () => void
  isLoading: boolean
}) {
  return (
    <CardSection title="Payment">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-ssa-black">
          $6 is required to be a SSA member, the fee includes:
        </p>
        <ul className="list-disc list-inside text-sm text-ssa-black space-y-1 ml-1">
          <li>
            Goodies and discounts from SSA sponsors when you show them your membership sticker
          </li>
          <li>Please be sure to collect your MEMBERSHIP CARD from the team.</li>
        </ul>
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={onPay}
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-[#635bff] text-white text-sm font-medium disabled:opacity-60"
          >
            {isLoading ? 'Processing...' : 'Pay'}
          </button>
          <p className="mx-auto text-xs border rounded-md px-3 py-1.5 text-gray-500 border-gray-300">
            Powered by Stripe
          </p>
        </div>
      </div>
    </CardSection>
  )
}
