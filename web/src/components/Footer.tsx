import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaTiktok,
  FaArrowRightLong,
} from 'react-icons/fa6'

type AnimatedFooterLinkProps = {
  href: string
  children: ReactNode
}

function AnimatedFooterLink({ href, children }: AnimatedFooterLinkProps) {
  const className = `
    group relative inline-flex w-fit items-center
    overflow-hidden pr-9
    text-ssa-white/80
    font-be-vietnam-pro font-semibold
    transition-colors duration-300 ease-out
    hover:text-ssa-white
    focus-visible:text-ssa-white
    focus-visible:outline-none
  `

  const content = (
    <>
      <FaArrowRightLong
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-0
          h-5 w-6
          -translate-x-full opacity-0
          transition-all duration-300 ease-out
          group-hover:translate-x-0
          group-hover:opacity-100
          group-focus-visible:translate-x-0
          group-focus-visible:opacity-100
        "
      />

      <span
        className="
          whitespace-nowrap
          transition-transform duration-300 ease-out
          group-hover:translate-x-9
          group-focus-visible:translate-x-9
        "
      >
        {children}
      </span>
    </>
  )

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  )
}

export default function Footer() {
  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/ssa.auckland/',
      icon: <FaInstagram className="h-8 w-8" />,
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/AucklandSSA/',
      icon: <FaFacebook className="h-8 w-8" />,
    },
    {
      label: 'LinkedIn',
      href: 'https://nz.linkedin.com/company/ssaauckland',
      icon: <FaLinkedin className="h-8 w-8" />,
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@ssa.auckland',
      icon: <FaTiktok className="h-8 w-8" />,
    },
  ]

  return (
    <footer className="w-full">
      <div
        className="
          relative w-full overflow-hidden rounded-t-[32px]
          px-6 pb-8 pt-10
          md:px-12 md:pb-12 md:pt-14
          lg:px-[97px] lg:pb-[69px] lg:pt-[72px]
        "
        style={{
          background:
            'radial-gradient(circle at 14% 42%, #FF637E 3%, #FE6982 28%, #FFA2A4 49%, #FFC6BA 69%, #FFDBC7 75%, #FFDFCA 83%, #FFE3CC 93%, #FFF1D5 100%)',
        }}
      >
        <Image
          src="/petals.svg"
          alt=""
          aria-hidden="true"
          width={854}
          height={416}
          className="
            pointer-events-none
            absolute right-[24px] top-[27px]
            hidden w-[520px]
            lg:right-[97px] lg:block lg:w-[854px]
          "
        />

        {/* Main content */}
        <div className="relative flex flex-col gap-10 md:flex-row md:flex-wrap md:items-start lg:gap-x-24 xl:gap-x-[100px]">
          {/* Social links + address */}
          <div className="flex flex-col gap-5">
            <div className="-ml-2 flex gap-2">
              {socialLinks.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-xl bg-transparent text-white
                  "
                >
                  {icon}
                </a>
              ))}
            </div>

            <p className="font-be-vietnam-pro text-base font-semibold leading-6 tracking-[-0.02em] text-ssa-white/80">
              The University Of
              <br />
              Auckland,
              <br />
              New Zealand
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-2 md:ml-10 lg:ml-16">
            <p className="font-be-vietnam-pro text-base font-semibold uppercase leading-6 tracking-[-0.02em] text-ssa-white">
              Learn More
            </p>

            <nav className="flex flex-col items-start gap-2">
              <AnimatedFooterLink href="/about">Our Team</AnimatedFooterLink>

              <AnimatedFooterLink href="/sponsors">
                Our Sponsors
              </AnimatedFooterLink>
            </nav>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-2">
            <p className="font-be-vietnam-pro text-base font-semibold uppercase leading-6 tracking-[-0.02em] text-ssa-white">
              Explore
            </p>

            <nav className="flex flex-col items-start gap-2">
              <AnimatedFooterLink href="/events">Events</AnimatedFooterLink>
            </nav>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-2">
            <p className="font-be-vietnam-pro text-base font-semibold uppercase leading-6 tracking-[-0.02em] text-ssa-white">
              Contact Us
            </p>

            <AnimatedFooterLink href="mailto:ssa.auckland@gmail.com">
              ssa.auckland@gmail.com
            </AnimatedFooterLink>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative mt-16 flex flex-col items-start justify-between gap-4 md:mt-20 md:flex-row md:items-center lg:mt-[110px]">
          <div className="flex items-center gap-2 font-be-vietnam-pro text-base font-normal leading-6 tracking-[-0.4px] text-ssa-white">
            <span className="leading-none">©</span>
            <span>Singapore Students&apos; Association</span>
          </div>

          {/* Logo + name */}
          <div className="flex items-center gap-3">
            <Image
              src="/ssa_logo.svg"
              alt="SSA Auckland logo"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />

            <span className="font-averia text-[11px] font-semibold lowercase leading-[1.2] tracking-wide text-ssa-white">
              singaporean
              <br />
              student
              <br />
              association
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
