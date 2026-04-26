'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
          h-[72px] bg-ssa-red
          flex items-center
          px-4 sm:px-6 lg:px-10
          transition-all duration-400
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
              width={50}
              height={50}
              className="object-contain w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {links.slice(0, 4).map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-[family-name:var(--font-averia)] text-ssa-black font-bold text-xl px-4 py-2 rounded hover:bg-white/20 hover:text-ssa-yellow transition-colors whitespace-nowrap"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Join SSA Button */}
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
          fixed top-[72px] left-0 right-0 z-40
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
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block font-[family-name:var(--font-averia)] font-bold text-lg text-ssa-black px-6 py-4 border-b border-white/10 hover:text-ssa-yellow hover:bg-white/10 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
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
