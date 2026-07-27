import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram, FaFacebook, FaLinkedin, FaTiktok } from 'react-icons/fa6'

export default function Footer() {
  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/ssa.auckland/',
      icon: <FaInstagram className="w-8 h-8" />,
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/AucklandSSA/',
      icon: <FaFacebook className="w-8 h-8" />,
    },
    {
      label: 'LinkedIn',
      href: 'https://nz.linkedin.com/company/ssaauckland',
      icon: <FaLinkedin className="w-8 h-8" />,
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@ssa.auckland',
      icon: <FaTiktok className="w-8 h-8" />,
    },
  ]

  return (
    <footer className="w-full">
      <div
        className="
          relative overflow-hidden rounded-t-[32px]
          px-6 md:px-12 lg:px-[97px]
          pt-10 md:pt-14 lg:pt-[72px]
          pb-8 md:pb-12 lg:pb-[69px]
          w-full
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
          className="pointer-events-none absolute top-[27px] right-[24px] hidden w-[520px] lg:right-[97px] lg:block lg:w-[854px]"
        />

        {/* Main content */}
        <div className="relative flex flex-col gap-10 md:flex-row md:flex-wrap md:items-start lg:gap-x-24 xl:gap-x-[100px]">
          {/* Social links + address */}
          <div className="flex flex-col gap-5">
            <div className="flex gap-2 -ml-2">
              {socialLinks.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-11 h-11 rounded-xl flex items-center justify-center
                    text-white bg-transparent
                  "
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="text-ssa-white/80 font-be-vietnam-pro font-semibold text-base leading-6 tracking-[-0.02em]">
              The University Of
              <br />
              Auckland,
              <br />
              New Zealand
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-3">
            <p className="text-ssa-white font-be-vietnam-pro font-semibold text-base leading-6 uppercase tracking-[-0.02em]">
              Learn More
            </p>
            <nav className="flex flex-col gap-2">
              {/* TODO: Figma spec = Inter 600. Using Be Vietnam Pro until Inter is added to theme */}
              <Link
                href="/about"
                className="text-ssa-white/80 font-be-vietnam-pro font-semibold"
              >
                Our Team
              </Link>
              {/* TODO: Figma spec = Inter 600. Using Be Vietnam Pro until Inter is added to theme */}
              <Link
                href="/sponsors"
                className="text-ssa-white/80 font-be-vietnam-pro font-semibold"
              >
                Our Sponsors
              </Link>
            </nav>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-3">
            <p className="text-ssa-white font-be-vietnam-pro font-semibold text-base leading-6 uppercase tracking-[-0.02em]">
              Explore
            </p>
            <nav className="flex flex-col gap-2">
              {/* TODO: Figma spec = Inter 600. Using Be Vietnam Pro until Inter is added to theme */}
              <Link
                href="/events"
                className="text-ssa-white/80 font-be-vietnam-pro font-semibold"
              >
                Events
              </Link>
            </nav>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-3">
            <p className="text-ssa-white font-be-vietnam-pro font-semibold text-base leading-6 uppercase tracking-[-0.02em]">
              Contact Us
            </p>
            {/* TODO: Figma spec = Inter 600. Using Be Vietnam Pro until Inter is added to theme */}
            <a
              href="mailto:ssa.auckland@gmail.com"
              className="text-ssa-white/80 font-be-vietnam-pro font-semibold break-all"
            >
              ssa.auckland@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative mt-16 md:mt-20 lg:mt-[110px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* TODO: Figma spec = Inter 400, tracking -0.4px. Using Be Vietnam Pro until Inter is added to theme */}
          <div className="flex items-center gap-2 text-ssa-white font-be-vietnam-pro font-normal text-base leading-6 tracking-[-0.4px]">
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
            <span className="text-ssa-white font-averia font-semibold text-[11px] leading-[1.2] tracking-wide lowercase">
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
