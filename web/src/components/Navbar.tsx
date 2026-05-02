'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Sponsors', href: '/sponsors' },
]

const ctaLink = { label: 'Join SSA!', href: '/contact' }

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const menuOpenRef = useRef(false)

  // Keep ref in sync with menuOpen state
  useEffect(() => {
    menuOpenRef.current = menuOpen
  }, [menuOpen])

  // Half-sticky scroll behaviour
  useEffect(() => {
    let lastY = window.scrollY

    const handleScroll = () => {
      if (menuOpenRef.current) return
      const y = window.scrollY
      if (y > lastY && y > 80) {
        setHidden(true)
      } else if (y <= lastY) {
        setHidden(false)
      }
      lastY = y
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[88px] bg-ssa-red border-b border-white/20 flex items-center px-4 sm:px-6 lg:px-10 transition-all duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0 shadow-lg'}`}
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
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group relative font-averia font-bold text-xl px-4 py-2 transition-colors whitespace-nowrap hover:text-ssa-yellow ${isActive ? 'text-ssa-yellow' : 'text-ssa-black'}`}
                  >
                    {label}
                    <span
                      className={`absolute bottom-0 left-4 right-4 h-[2px] bg-ssa-yellow transition-transform duration-200 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center ml-auto">
            <Link
              href={ctaLink.href}
              className="font-averia font-bold text-xl text-ssa-black bg-ssa-yellow-light px-5 py-2 rounded-full hover:bg-ssa-yellow transition-colors shrink-0"
            >
              {ctaLink.label}
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden ml-auto flex flex-col justify-center gap-[5px] w-10 h-10 p-1 shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
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
        id="mobile-menu"
        className={`fixed top-[88px] left-0 right-0 z-40 bg-ssa-red border-t border-white/20 transition-all duration-300 ease-in-out md:hidden ${menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
      >
        <ul className="flex flex-col">
          {[...navLinks, ctaLink].map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block font-averia font-bold text-lg px-6 py-4 border-b border-white/10 border-l-4 hover:text-ssa-yellow transition-colors ${isActive ? 'text-ssa-yellow border-l-ssa-yellow' : 'text-ssa-black border-l-transparent'}`}
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
