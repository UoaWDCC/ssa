'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FaUserCircle } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'EVENTS', href: '/events' },
  { label: 'SPONSORS', href: '/sponsors' },
]

const ctaLink = { label: 'JOIN SSA!', href: '/signup' }

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const menuOpenRef = useRef(false)
  const auth = useAuth()
  const isAuthenticated = auth.status === 'authenticated'
  const authResolved = auth.status !== 'loading'

  let mobileAuthLinks: { label: string; href: string }[] = []
  if (authResolved && isAuthenticated) {
    mobileAuthLinks = [{ label: 'Profile', href: '/profile' }]
  } else if (authResolved) {
    mobileAuthLinks = [ctaLink]
  }

  useEffect(() => {
    menuOpenRef.current = menuOpen
  }, [menuOpen])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHidden(window.scrollY > 80)

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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[88px] bg-ssa-red border-b border-white/20 flex items-center px-4 sm:px-6 lg:px-10 transition-all duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0 shadow-lg'}`}
      >
        <div className="relative w-full flex items-center justify-center">
          {/* Logo — pinned to the left */}
          <Link
            href="/"
            className="absolute left-0 shrink-0"
            aria-label="SSA Home"
          >
            <Image
              src="/mascot.png"
              alt="SSA Mascot"
              width={56}
              height={56}
              className="object-contain w-[46px] h-[46px] sm:w-[56px] sm:h-[56px]"
            />
          </Link>

          <ul className="group hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className="relative font-['Be_Vietnam_Pro'] font-semibold text-base leading-6 tracking-[-0.02em] uppercase px-4 py-2 text-ssa-white transition-opacity duration-200 whitespace-nowrap group-hover:opacity-60 hover:!opacity-100"
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="absolute right-0 hidden md:flex items-center gap-3">
            {authResolved && isAuthenticated && (
              <Link
                href="/profile"
                aria-label="My profile"
                className="text-ssa-black hover:text-ssa-yellow transition-colors shrink-0"
              >
                <FaUserCircle className="w-9 h-9" />
              </Link>
            )}
            {authResolved && !isAuthenticated && (
              <Link
                href={ctaLink.href}
                className="font-be-vietnam-pro font-bold text-xl text-ssa-black bg-ssa-yellow-light px-5 py-2 rounded-full hover:bg-ssa-yellow transition-colors shrink-0"
              >
                {ctaLink.label}
              </Link>
            )}
          </div>

          {/* Hamburger — pinned to the right on mobile */}
          <button
            className="md:hidden absolute right-0 flex flex-col justify-center gap-[5px] w-10 h-10 p-1 shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`block h-[3px] w-6 bg-ssa-white rounded transition-all duration-300 ${menuOpen ? 'translate-y-[8px] rotate-45' : ''}`}
            />
            <span
              className={`block h-[3px] w-6 bg-ssa-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}
            />
            <span
              className={`block h-[3px] w-6 bg-ssa-white rounded transition-all duration-300 ${menuOpen ? '-translate-y-[8px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed top-[88px] left-0 right-0 z-40 bg-ssa-red border-t border-white/20 transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col">
          {[...navLinks, ...mobileAuthLinks].map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className="block w-full font-be-vietnam-pro font-bold text-2xl leading-8 tracking-[-0.04em] text-white px-6 py-4 border-b border-white/10 transition-opacity duration-200 hover:opacity-70"
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Backdrop to close mobile menu on outside tap */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 md:hidden cursor-default"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
