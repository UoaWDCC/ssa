import Image from 'next/image'

interface HeroProps {
  title: string
  subtitle: string
  mascotImage?: string
}

export default function Hero({ title, subtitle, mascotImage }: HeroProps) {
  return (
    <div className="relative flex items-center justify-between rounded-3xl bg-ssa-red px-16 overflow-hidden w-full aspect-[12/7]">
      <div className="flex flex-col gap-4 max-w-xl z-10">
        <h1
          className="font-[family-name:var(--font-averia)] font-bold text-ssa-black"
          style={{ fontSize: '98px', lineHeight: '100px' }}
        >
          {title}
        </h1>
        <p
          className="font-[family-name:var(--font-averia)] font-light text-ssa-black"
          style={{ fontSize: '30px', lineHeight: '30.5px' }}
        >
          {subtitle}
        </p>
      </div>
      {mascotImage && (
        <div className="hidden sm:block absolute bottom-0 right-12">
          <Image
            src={mascotImage}
            alt="mascot"
            width={470.92}
            height={433.92}
            className="object-contain opacity-70"
            priority
          />
        </div>
      )}
    </div>
  )
}
