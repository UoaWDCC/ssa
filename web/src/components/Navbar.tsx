'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FaUserCircle } from 'react-icons/fa'
import { FiArrowUpRight } from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/Button'

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'EVENTS', href: '/events' },
  { label: 'SPONSORS', href: '/sponsors' },
]

const ctaLink = { label: 'JOIN SSA!', href: '/signup' }
const signInLink = { label: 'SIGN IN', href: '/sign-in' }

// Order for the mobile menu differs from the desktop nav (matches Figma)
const mobileNavOrder = ['/', '/events', '/sponsors', '/about']

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const menuOpenRef = useRef(false)
  const auth = useAuth()
  const isAuthenticated = auth.status === 'authenticated'
  const authResolved = auth.status !== 'loading'

  // SIGN IN is intentionally excluded from the mobile menu — it stays
  // desktop-only (see the `hidden md:flex` auth cluster below). Mobile only
  // ever shows the CTA (JOIN SSA!) or, once authenticated, the Profile link.
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
        className={`fixed top-0 left-0 right-0 z-50 h-[88px] bg-ssa-red border-b border-white/20 flex items-center px-4 sm:px-6 lg:px-10 transition-all duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        {/*
          3-column grid instead of `flex justify-between` — with the logo and the
          auth-button cluster being different widths, `flex-1 justify-center` on the
          nav links only centers them within the *leftover* space, which visibly
          drifts left/right depending on how wide the other two ends are. A grid with
          two edge tracks always leaves the middle (`auto`) track centered on the
          full bar.

          The edge tracks are `minmax(max-content, 1fr)`, not bare `1fr` — a plain
          `1fr` track is still allowed to shrink below its content's natural width
          once space gets tight, which at in-between viewport widths let the logo or
          button cluster get squeezed thinner than it needed and start overlapping
          the centered nav links. `max-content` as the floor means these columns can
          grow to share leftover space (keeping the center track genuinely centered)
          but can never be compressed past what their content actually needs.
        */}
        <div className="w-full flex md:grid items-center justify-between md:justify-normal grid-cols-[minmax(max-content,1fr)_auto_minmax(max-content,1fr)] gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 justify-self-start"
            aria-label="SSA Home"
          >
            <Image
              src="/merlion_logo.png"
              alt="SSA Mascot"
              width={56}
              height={56}
              className="object-contain w-[46px] h-[46px] sm:w-[56px] sm:h-[56px]"
            />
            <span className="flex flex-col justify-center w-[55px] h-[30px] sm:w-[62px] sm:h-[31px] font-be-vietnam-pro font-semibold text-[10.4px] leading-[10px] tracking-[-0.65px] sm:text-[11.73px] sm:leading-[10.27px] sm:tracking-[-0.73px] text-ssa-white lowercase">
              singapore
              <br />
              student
              <br />
              association
            </span>
          </Link>

          <ul className="group hidden md:flex items-center gap-1 justify-self-center">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className="relative font-be-vietnam-pro font-semibold text-base leading-6 tracking-[-0.02em] uppercase px-4 py-2 text-ssa-white transition-opacity duration-200 whitespace-nowrap group-hover:opacity-60 hover:!opacity-100"
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center justify-end gap-3 justify-self-end">
            <div className="hidden md:flex items-center gap-3">
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
                <>
                  {/* Salmon pill, white text. Arrow sits on the right at rest and
                      wipes to the left on hover — that's the default `arrowSide`
                      ('right'), so the prop is omitted. Type overridden to match
                      Figma exactly: 16px/600(SemiBold)/-2% tracking, vs. the
                      component's default 14px/700(Bold). */}
                  <Button
                    href={ctaLink.href}
                    variant="filled"
                    color="white"
                    size="short"
                    className="!w-[144.67px] !h-[44px] !rounded-[26.67px] !text-base !font-semibold !tracking-[-0.02em] !whitespace-nowrap !bg-ssa-salmon !text-ssa-white hover:!bg-ssa-white hover:!text-ssa-salmon"
                  >
                    {ctaLink.label}
                  </Button>
                  {/* Outline pill, no arrow, 108×44 per Figma spec. Same type
                      override as JOIN SSA! for consistency. Desktop-only —
                      SIGN IN does not appear in the mobile menu. */}
                  <Button
                    href={signInLink.href}
                    variant="outline"
                    color="white"
                    arrow={false}
                    size="short"
                    className="!w-[108px] !h-[44px] !rounded-[26.67px] !text-base !font-semibold !tracking-[-0.02em] !whitespace-nowrap hover:!bg-ssa-white hover:!text-ssa-salmon hover:!border-ssa-white"
                  >
                    {signInLink.label}
                  </Button>
                </>
              )}
            </div>

            {/* Hamburger — normal flow on the right on mobile */}
            <button
              className="md:hidden flex flex-col justify-center gap-[5px] w-10 h-10 p-1 shrink-0"
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
        <ul className="flex flex-col gap-6 px-6 py-6">
          {mobileNavOrder.map((href) => {
            const link = navLinks.find((l) => l.href === href)
            if (!link) return null
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className="block font-be-vietnam-pro font-bold text-2xl leading-8 tracking-[-0.04em] text-white transition-opacity duration-200 hover:opacity-70"
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
          {mobileAuthLinks.map(({ label, href }) => {
            const isActive = pathname === href
            const isCta = href === ctaLink.href
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className="flex items-center justify-between font-be-vietnam-pro font-bold text-2xl leading-8 tracking-[-0.04em] text-white transition-opacity duration-200 hover:opacity-70"
                >
                  {label}
                  {isCta && <FiArrowUpRight className="w-6 h-6 shrink-0" />}
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
