'use client'
import Image from 'next/image'
import Script from 'next/script'

export default function InstagramFeed() {
  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src="/favicon.ico"
            alt="SSA logo"
            width={49}
            height={46}
            className="shrink-0"
          />
          <span className="font-be-vietnam-pro font-bold text-ssa-red text-2xl truncate leading-none">
            Singaporean Students&apos; Association
          </span>
        </div>
        <a
          href="https://www.instagram.com/ssa.auckland"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[16.38px] font-be-vietnam-pro uppercase tracking-[-0.02em] bg-ssa-salmon text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity shrink-0 whitespace-nowrap flex items-center justify-center"
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
    </section>
  )
}
