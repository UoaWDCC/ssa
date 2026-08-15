import Image from 'next/image'

import Button from '@/components/Button'

const receiptDetails = [
  { label: 'Name', value: 'Merlion' },
  { label: 'Order date', value: '27/03/2026', dateTime: '2026-03-27' },
  { label: 'Event name', value: 'Ice Kachang' },
  { label: 'Event date', value: '2/04/2026', dateTime: '2026-04-02' },
  { label: 'Paid', value: '$11' },
]

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-[calc(100dvh-88px)] bg-ssa-background text-ssa-grey">
      <div className="mx-auto grid min-h-[calc(100dvh-88px)] w-full max-w-[1250px] items-center gap-12 px-5 py-8 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(20rem,0.95fr)] md:gap-10 md:py-6 lg:gap-16 lg:px-16 lg:py-10 xl:px-0">
        <section aria-labelledby="payment-success-title" className="min-w-0">
          <Image
            src="/ssa_logo.svg"
            alt="SSA Merlion mascot"
            width={72}
            height={72}
            priority
            className="size-[72px]"
          />

          <h1
            id="payment-success-title"
            className="mt-4 max-w-[18ch] font-be-vietnam-pro text-[clamp(1.65rem,3.2vw,2rem)] font-bold leading-[1.3] tracking-[-0.045em] text-ssa-red"
          >
            Payment successful!
            <br />
            We’ll see you at the event.
          </h1>

          <p className="mt-2 max-w-[38ch] font-inter text-base leading-6 text-ssa-muted-grey">
            Please check your email for confirmation and further instructions
            about our event.
          </p>

          <Button
            href="/"
            size="long"
            color="salmon"
            className="mt-10 min-h-12 max-w-[335px] !py-3 !text-base"
          >
            GO TO HOME
          </Button>
        </section>

        <section
          aria-labelledby="payment-summary-title"
          className="w-full rounded-[30px] bg-ssa-form-field px-7 py-10 sm:px-10 sm:py-12 md:min-h-[295px] md:justify-self-end"
        >
          <h2 id="payment-summary-title" className="sr-only">
            Payment summary
          </h2>

          <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-8 gap-y-7 font-dm-mono text-xs uppercase tracking-[-0.02em]">
            {receiptDetails.map(({ label, value, dateTime }) => (
              <div key={label} className="contents">
                <dt className="text-[#c2bdb5]">{label}</dt>
                <dd className="text-right text-ssa-grey">
                  {dateTime ? <time dateTime={dateTime}>{value}</time> : value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  )
}
