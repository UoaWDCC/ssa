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
      <div className="rounded-t-3xl px-6 md:px-12 lg:px-30 py-12 w-full bg-ssa-red">
        {/* Main content */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Social links */}
          <div className="flex flex-col gap-1">
            <p className="text-ssa-white font-averia font-bold text-xl tracking-tight">
              Find us on...
            </p>
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
                    hover:bg-ssa-yellow hover:text-ssa-red
                    transition-all duration-300 ease-in-out
                  "
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-10 lg:gap-30">
            {/* About Us */}
            <div className="flex flex-col gap-3">
              <p className="text-ssa-white font-averia font-bold text-lg tracking-tight">
                About Us
              </p>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/about"
                  className="text-ssa-white font-averia hover:text-ssa-yellow text-base font-bold transition-colors duration-300"
                >
                  Our Team
                </Link>
                <Link
                  href="/sponsors"
                  className="text-ssa-white font-averia hover:text-ssa-yellow text-base font-bold transition-colors duration-300"
                >
                  Our Sponsors
                </Link>
              </nav>
            </div>

            {/* Explore */}
            <div className="flex flex-col gap-3">
              <p className="text-ssa-white font-averia font-bold text-lg tracking-tight">
                Explore
              </p>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/events"
                  className="text-ssa-white font-averia hover:text-ssa-yellow text-base font-bold transition-colors duration-300"
                >
                  Events
                </Link>
              </nav>
            </div>

            {/* Contact Us */}
            <div className="flex flex-col gap-3">
              <p className="text-ssa-white font-averia font-bold text-lg tracking-tight">
                Contact Us
              </p>
              <a
                href="mailto:ssa.auckland@gmail.com"
                className="text-ssa-white font-averia hover:text-ssa-yellow text-base font-bold transition-colors duration-300 break-all"
              >
                ssa.auckland@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-ssa-white text-sm font-averia">
            <span className="text-base leading-none">©</span>
            <span>Singaporean Students&apos; Association</span>
          </div>

          {/* Logo + name */}
          <div className="flex items-center gap-3">
            <Image
              src="/ssa-logo.svg"
              alt="SSA Auckland logo"
              width={48}
              height={48}
              className="rounded-full object-cover border-2 border-white/40"
            />
            <span className="text-ssa-white font-averia font-semibold text-sm leading-tight">
              Singaporean Students&apos;
              <br />
              Association Auckland
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
