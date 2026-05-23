import CardSection from '@/components/CardSection'

interface PaymentStepProps {
  onPay: () => void
  eventCost: number
  isLoading: boolean
}

const PaymentStep = ({ onPay, eventCost, isLoading }: PaymentStepProps) => {
  return (
    <CardSection title="Payment">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-ssa-black">
          A ticket to this event costs ${eventCost.toFixed(2)}
        </p>
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={onPay}
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-stripe-purple text-white text-sm font-medium disabled:opacity-60"
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

export default PaymentStep
