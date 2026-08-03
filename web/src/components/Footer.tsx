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
    font-inter text-base font-semibold
    leading-6 tracking-normal
    text-footer-white/80
    transition-colors duration-300 ease-out
    hover:text-footer-white
    focus-visible:text-footer-white
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
      icon: <FaInstagram className="h-10 w-10 md:h-8 md:w-8" />,
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/AucklandSSA/',
      icon: <FaFacebook className="h-10 w-10 md:h-8 md:w-8" />,
    },
    {
      label: 'LinkedIn',
      href: 'https://nz.linkedin.com/company/ssaauckland',
      icon: <FaLinkedin className="h-10 w-10 md:h-8 md:w-8" />,
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@ssa.auckland',
      icon: <FaTiktok className="h-10 w-10 md:h-8 md:w-8" />,
    },
  ]

  return (
    <footer className="w-full">
      <div
        className="
          relative h-56 w-full overflow-hidden
          rounded-t-[20px] px-6 py-6

          md:h-auto md:rounded-t-4xl
          md:px-12 md:pb-12 md:pt-14

          lg:px-24.25 lg:pb-17.25 lg:pt-18
        "
      >
        {/* Mobile gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{
            background: `
            linear-gradient(
              132deg,
              var(--color-footer-pink-1) 3%,
              var(--color-footer-pink-2) 40%,
              var(--color-footer-pink-3) 65%,
              var(--color-footer-peach-1) 81%,
              var(--color-footer-peach-2) 87%,
              var(--color-footer-peach-3) 93%,
              var(--color-footer-peach-4) 97%,
              var(--color-footer-cream) 100%
            )
            `,
          }}
        />

        {/* Tablet and desktop gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            background: `
              linear-gradient(
                29deg,
                var(--color-footer-pink-1) 3%,
                var(--color-footer-pink-2) 57%,
                var(--color-footer-pink-3) 87%,
                var(--color-footer-peach-1) 100%
              )
            `,
          }}
        />

        {/* Decorative petals */}
        <Image
          src="/petals.svg"
          alt=""
          aria-hidden="true"
          width={854}
          height={416}
          className="
            pointer-events-none
            absolute right-6 top-6.75 z-5
            hidden w-130

            lg:right-24.25 lg:block lg:w-213.5
          "
        />

        {/* Main content */}
        <div
          className="
            relative z-10 flex flex-col
            md:flex-row md:items-start
          "
        >
          {/* Social links and address */}
          <div
            className="
              flex shrink-0 flex-col
              md:w-55 md:gap-5
              lg:w-75
            "
          >
            {/* Mobile heading */}
            <p
              className="
                mb-2.5
                font-be-vietnam-pro
                text-base font-semibold uppercase
                leading-6 tracking-normal
                text-footer-white
                md:hidden
              "
            >
              Find us on...
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 md:-ml-2 md:gap-2">
              {socialLinks.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex h-10 w-10 items-center justify-center
                    bg-transparent text-footer-white

                    transition-transform duration-300 ease-out
                    hover:-translate-y-1
                    focus-visible:-translate-y-1
                    focus-visible:outline-none

                    md:h-11 md:w-11
                  "
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Desktop address */}
            <p
              className="
                hidden
                font-be-vietnam-pro
                text-base font-semibold
                leading-6 tracking-normal
                text-footer-white/80
                md:block
              "
            >
              The University Of
              <br />
              Auckland,
              <br />
              New Zealand
            </p>
          </div>

          {/* Desktop navigation */}
          <div
            className="
              hidden
              md:flex md:flex-nowrap md:items-start md:gap-x-8
              lg:gap-x-16
            "
          >
            {/* Learn More */}
            <div className="flex shrink-0 flex-col gap-2">
              <p
                className="
                  font-be-vietnam-pro
                  text-base font-semibold uppercase
                  leading-6 tracking-normal
                  text-footer-white
                "
              >
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
            <div className="flex shrink-0 flex-col gap-2">
              <p
                className="
                  font-be-vietnam-pro
                  text-base font-semibold uppercase
                  leading-6 tracking-normal
                  text-footer-white
                "
              >
                Explore
              </p>

              <nav className="flex flex-col items-start gap-2">
                <AnimatedFooterLink href="/events">Events</AnimatedFooterLink>
              </nav>
            </div>

            {/* Contact Us */}
            <div className="flex shrink-0 flex-col gap-2">
              <p
                className="
                  font-be-vietnam-pro
                  text-base font-semibold uppercase
                  leading-6 tracking-normal
                  text-footer-white
                "
              >
                Contact Us
              </p>

              <AnimatedFooterLink href="mailto:ssa.auckland@gmail.com">
                ssa.auckland@gmail.com
              </AnimatedFooterLink>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="
            absolute bottom-6 left-6 right-6 z-10
            flex items-center justify-between gap-3

            md:relative
            md:bottom-auto md:left-auto md:right-auto
            md:mt-20

            lg:mt-27.5
          "
        >
          {/* Copyright */}
          <div
            className="
              flex items-center gap-2 whitespace-nowrap
              font-be-vietnam-pro
              text-[11px] font-normal
              leading-4 tracking-[-0.2px]
              text-footer-white

              sm:text-xs

              md:text-base md:leading-6
              md:tracking-[-0.4px]
            "
          >
            <span className="text-base leading-none">©</span>

            <span>Singapore Students&apos; Association</span>
          </div>

          {/* Logo and association name */}
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <Image
              src="/ssa_logo.svg"
              alt="SSA Auckland logo"
              width={48}
              height={48}
              className="
                h-10 w-10 rounded-full object-cover
                md:h-12 md:w-12
              "
            />

            <span
              className="
                w-13.5
                font-be-vietnam-pro
                text-[9px] font-semibold
                leading-2.25
                tracking-[-0.35px]
                text-footer-white

                md:w-16.25
                md:text-[12.33px]
                md:leading-[10.79px]
                md:tracking-[-0.77px]
              "
            >
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
