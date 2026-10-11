'use client'
import Image from 'next/image'
import Script from 'next/script'

export default function InstagramFeed() {
  return (
    <section className="px-[21px] py-12 md:px-10 md:py-20 lg:px-16">
      {/* Shares the home page's container with the carousel and Join SSA card
          above, so the three blocks line up on one pair of edges. */}
      <div className="mx-auto w-full max-w-[1250px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Image
              src="/merlion_logo.png"
              alt="SSA logo"
              width={39}
              height={39}
              className="shrink-0 w-[34px] h-[34px] sm:w-[39px] sm:h-[39px] object-contain"
            />
            <span className="flex flex-col justify-center w-[73px] h-[35px] sm:w-[81px] sm:h-[39px] font-be-vietnam-pro font-semibold text-[12.92px] leading-[11.62px] tracking-[-0.83px] sm:text-[14.33px] sm:leading-[12.88px] sm:tracking-[-0.92px] text-ssa-red lowercase">
              singapore
              <br />
              student
              <br />
              association
            </span>
          </div>
          <a
            href="https://www.instagram.com/ssa.auckland"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16.38px] font-be-vietnam-pro font-semibold uppercase tracking-[-0.02em] bg-ssa-salmon text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity shrink-0 whitespace-nowrap flex items-center justify-center"
          >
            Follow Us
          </a>
        </div>
        {/* Elfsight Instagram Feed widget */}
        <div
          className="elfsight-app-7b244e26-a35a-49f2-8720-d876ece2cf15"
          data-elfsight-app-lazy
        ></div>
        <Script
          src="https://static.elfsight.com/platform/platform.js"
          strategy="lazyOnload"
        />
      </div>
    </section>
  )
}
