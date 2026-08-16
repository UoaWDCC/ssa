import Image from 'next/image'

import Button from '@/components/Button'

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

type Registration = {
  id: number
  firstName: string
  lastName: string
  amount: number
  currency: string
  createdAt: string
  paidAt?: string | null
  event: {
    id: number
    title: string
    date: string
  }
}

type Confirmation =
  | { status: 'confirmed'; registration: Registration }
  | { status: 'pending' | 'unavailable' | 'missing' }

type ReceiptDetail = {
  label: string
  value: string
  dateTime?: string
}

function isRegistration(value: unknown): value is Registration {
  if (typeof value !== 'object' || value === null) return false

  const registration = value as Partial<Registration>
  return (
    typeof registration.id === 'number' &&
    typeof registration.firstName === 'string' &&
    typeof registration.lastName === 'string' &&
    typeof registration.amount === 'number' &&
    typeof registration.currency === 'string' &&
    typeof registration.createdAt === 'string' &&
    typeof registration.event === 'object' &&
    registration.event !== null &&
    typeof registration.event.id === 'number' &&
    typeof registration.event.title === 'string' &&
    typeof registration.event.date === 'string'
  )
}

async function confirmEventPayment(sessionId?: string): Promise<Confirmation> {
  if (!sessionId) return { status: 'missing' }

  const cmsUrl = process.env.CMS_URL?.replace(/\/$/, '')
  const internalSecret =
    process.env.GOOGLE_OAUTH_COOKIE_SECRET || process.env.AUTH_SECRET

  if (!cmsUrl || !internalSecret) return { status: 'unavailable' }

  try {
    const response = await fetch(
      `${cmsUrl}/event-registration?session_id=${encodeURIComponent(sessionId)}`,
      {
        cache: 'no-store',
        headers: { 'x-ssa-internal-secret': internalSecret },
      },
    )

    if (!response.ok) return { status: 'unavailable' }

    const result = (await response.json()) as {
      confirmed?: boolean
      registration?: unknown
    }

    if (!result.confirmed) return { status: 'pending' }
    if (!isRegistration(result.registration)) return { status: 'unavailable' }

    return { status: 'confirmed', registration: result.registration }
  } catch {
    return { status: 'unavailable' }
  }
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-NZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Pacific/Auckland',
  }).format(date)
}

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount)
  } catch {
    return `${amount} ${currency.toUpperCase()}`
  }
}

export default async function PaymentSuccessPage({
  searchParams,
}: Readonly<Props>) {
  const params = await searchParams
  const confirmation = await confirmEventPayment(params.session_id)
  const isConfirmed = confirmation.status === 'confirmed'

  const copy = {
    confirmed: {
      title: (
        <>
          Payment successful!
          <br />
          We’ll see you at the event.
        </>
      ),
      description:
        'Please check your email for confirmation and further instructions about our event.',
    },
    pending: {
      title: 'Your payment is processing.',
      description:
        'We are waiting for payment confirmation. Please check your email for updates.',
    },
    unavailable: {
      title: 'We could not confirm your payment yet.',
      description:
        'If you completed checkout, your registration will be updated automatically. Please check your email for updates.',
    },
    missing: {
      title: 'Payment details are unavailable.',
      description:
        'Return to the event page if you still need to complete your registration.',
    },
  }[confirmation.status]

  const receiptDetails: ReceiptDetail[] = isConfirmed
    ? [
        {
          label: 'Name',
          value: `${confirmation.registration.firstName} ${confirmation.registration.lastName}`,
        },
        {
          label: 'Registration',
          value: `#${confirmation.registration.id}`,
        },
        {
          label: 'Order date',
          value: formatDate(
            confirmation.registration.paidAt ??
              confirmation.registration.createdAt,
          ),
          dateTime:
            confirmation.registration.paidAt ??
            confirmation.registration.createdAt,
        },
        {
          label: 'Event name',
          value: confirmation.registration.event.title,
        },
        {
          label: 'Event date',
          value: formatDate(confirmation.registration.event.date),
          dateTime: confirmation.registration.event.date,
        },
        {
          label: 'Paid',
          value: formatPrice(
            confirmation.registration.amount,
            confirmation.registration.currency,
          ),
        },
      ]
    : [
        {
          label: 'Status',
          value: {
            pending: 'Awaiting confirmation',
            unavailable: 'Confirmation unavailable',
            missing: 'No payment session',
          }[confirmation.status],
        },
      ]

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
            {copy.title}
          </h1>

          <p className="mt-2 max-w-[38ch] font-inter text-base leading-6 text-ssa-muted-grey">
            {copy.description}
          </p>

          <Button
            href={isConfirmed ? '/' : '/events'}
            size="long"
            color="salmon"
            className="mt-10 min-h-12 max-w-[335px] !py-3 !text-base"
          >
            {isConfirmed ? 'GO TO HOME' : 'GO TO EVENTS'}
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
