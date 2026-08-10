import Image from 'next/image'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import ExecGrid from './_components/ExecGrid'

export default function AboutPage() {
  return (
    <main className="flex flex-col bg-[#fffbf4] text-[#434242]">
      <div className="-mt-[88px] overflow-hidden rounded-2xl bg-ssa-red pt-[88px]">
        <Hero
          title="About Us"
          subtitle="We are a community that promotes and celebrates Singapore culture and traditions through social activities (and food!)"
        />
      </div>

      <section className="mx-auto w-full max-w-[1440px] px-[18px] pt-[32px] sm:px-8 md:px-12 md:pt-16 lg:px-16 xl:px-[clamp(24px,6.8056vw,98px)] xl:pt-[88px]">
        <div className="relative aspect-[366/236.6457] w-full overflow-hidden rounded-[4px] md:aspect-[1244/573] md:rounded-[12px]">
          <Image
            src="/about-team.png"
            alt="Members of the Singapore Students’ Association holding the association banner"
            width={1388}
            height={850}
            priority
            sizes="(max-width: 639px) calc(100vw - 36px), (max-width: 767px) calc(100vw - 64px), (max-width: 1023px) calc(100vw - 96px), (max-width: 1279px) calc(100vw - 128px), (max-width: 1439px) 86.4vw, 1244px"
            className="absolute left-[-11.15%] top-[-4.69%] h-[115.97%] w-[122.45%] max-w-none md:top-[-6.58%] md:h-[162.73%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[rgba(50,50,50,0.2)] md:hidden"
          />
        </div>
      </section>

      <ExecGrid />
      <Footer />
    </main>
  )
}
