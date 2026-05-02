'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    let lastY = window.scrollY
    const handleScroll = () => {
      const y = window.scrollY
      setHidden(y > lastY && y > 80)
      setScrolled(y > 10)
      lastY = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const links = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Sponsors', href: '/sponsors' },
    { label: 'Join SSA!', href: '/contact' },
  ]

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          h-[100px] bg-ssa-red
          border-b border-white/20
          flex items-center
          px-4 sm:px-6 lg:px-10
          transition-all duration-300
          ${hidden ? '-translate-y-full' : 'translate-y-0'}
          ${scrolled ? 'shadow-lg' : ''}
        `}
      >
        <div className="w-full flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="SSA Home">
            <Image
              src="/mascot.png"
              alt="SSA Mascot"
              width={56}
              height={56}
              className="object-contain w-[46px] h-[46px] sm:w-[56px] sm:h-[56px]"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {links.slice(0, 4).map(({ label, href }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      relative font-[family-name:var(--font-averia)] font-bold text-xl
                      px-4 py-2 transition-colors whitespace-nowrap
                      hover:text-ssa-yellow
                      ${isActive ? 'text-ssa-yellow' : 'text-ssa-black'}
                    `}
                  >
                    {label}

                    <span
                      className={`
                        absolute bottom-0 left-4 right-4 h-[2px] bg-ssa-yellow
                        transition-transform duration-200
                        ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                      `}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center ml-auto">
            <Link
              href="/contact"
              className="font-[family-name:var(--font-averia)] font-bold text-xl text-ssa-black bg-ssa-yellow-light px-5 py-2 rounded-full hover:bg-ssa-yellow transition-colors shrink-0"
            >
              Join SSA!
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden ml-auto flex flex-col justify-center gap-[5px] w-10 h-10 p-1 shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-[3px] w-6 bg-ssa-black rounded transition-all duration-300 ${menuOpen ? 'translate-y-[8px] rotate-45' : ''}`}
            />
            <span
              className={`block h-[3px] w-6 bg-ssa-black rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}
            />
            <span
              className={`block h-[3px] w-6 bg-ssa-black rounded transition-all duration-300 ${menuOpen ? '-translate-y-[8px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div
        className={`
          fixed top-[88px] left-0 right-0 z-40
          bg-ssa-red
          border-t border-white/20
          transition-all duration-300 ease-in-out
          md:hidden
          ${
            menuOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }
        `}
      >
        <ul className="flex flex-col">
          {links.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    block font-[family-name:var(--font-averia)] font-bold text-lg
                    px-6 py-4 border-b border-white/10
                    hover:text-ssa-yellow transition-colors
                    ${isActive ? 'text-ssa-yellow border-l-4 border-l-ssa-yellow' : 'text-ssa-black'}
                  `}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
