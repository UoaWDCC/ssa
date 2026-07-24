import Link from 'next/link'
import type React from 'react'
import { FaArrowRight } from 'react-icons/fa6'

export type ButtonSize = 'short' | 'long'
export type ButtonVariant = 'filled' | 'light' | 'outline'
export type ButtonColor = 'red' | 'yellow' | 'skin'

/**
 * Shared SSA pill button (matches the finalized "JOIN SSA!" Figma design).
 *
 * A fully-rounded pill with a soft layered depth, Averia bold text and an optional
 * right-pointing arrow that **swaps from the right to the left on hover** while the
 * fill lightens and the pill lifts.
 *
 * - `size`    — `short` (content width) or `long` (full-width CTA).
 * - `variant` — `filled` (accent fill, light text) · `light` (cream fill, accent text) · `outline`.
 * - `color`   — accent token driving the colour so it can be changed via a prop.
 * - `arrow`   — show the animated swap arrow (default `true`).
 * - `href`    — when set, renders a Next `Link`; otherwise a native `<button>`.
 */

const base =
  'group relative inline-flex items-center justify-center rounded-full font-averia font-bold leading-tight cursor-pointer select-none transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-ssa-muted-gold focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none'

const sizes: Record<ButtonSize, string> = {
  short: 'px-9 py-2.5 text-base md:px-10 md:py-3 md:text-lg',
  long: 'w-full px-10 py-3.5 text-lg',
}

// Colour treatments — full literal class strings so Tailwind can detect them.
const treatments: Record<ButtonVariant, Record<ButtonColor, string>> = {
  filled: {
    red: 'bg-ssa-red text-ssa-white shadow-[0_5px_0_0_#ff9fb0] hover:bg-ssa-red-light hover:shadow-[0_7px_0_0_#ff9fb0]',
    yellow:
      'bg-ssa-yellow text-ssa-muted-gold shadow-[0_5px_0_0_#f2d9a3] hover:bg-ssa-yellow-light hover:shadow-[0_7px_0_0_#f2d9a3]',
    skin: 'bg-ssa-skin-yellow text-ssa-category-text shadow-[0_5px_0_0_#ffd586] hover:bg-ssa-dark-skin-yellow hover:shadow-[0_7px_0_0_#ffd586]',
  },
  light: {
    red: 'bg-ssa-yellow-light text-ssa-red shadow-[0_4px_0_0_#f6e6c9] hover:bg-ssa-white',
    yellow:
      'bg-ssa-yellow-light text-ssa-muted-gold shadow-[0_4px_0_0_#f6e6c9] hover:bg-ssa-white',
    skin: 'bg-ssa-yellow-light text-ssa-category-text shadow-[0_4px_0_0_#f6e6c9] hover:bg-ssa-white',
  },
  outline: {
    red: 'bg-transparent border-[3px] border-ssa-red text-ssa-red hover:bg-ssa-red hover:text-ssa-white',
    yellow:
      'bg-transparent border-[3px] border-ssa-dark-skin-yellow text-ssa-muted-gold hover:bg-ssa-dark-skin-yellow hover:text-ssa-white',
    skin: 'bg-transparent border-[3px] border-ssa-dark-skin-yellow text-ssa-category-text hover:bg-ssa-skin-yellow',
  },
}

// Hover lifts the pill off its shadow; active presses it back down.
const variantMotion: Record<ButtonVariant, string> = {
  filled: 'hover:-translate-y-0.5 active:translate-y-1 active:shadow-none',
  light: 'hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none',
  outline: 'active:scale-[0.97]',
}

type CommonProps = {
  children: React.ReactNode
  size?: ButtonSize
  variant?: ButtonVariant
  color?: ButtonColor
  /** Show the animated right→left swap arrow. */
  arrow?: boolean
  className?: string
}

type ButtonElementProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined
  }

type LinkElementProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string
  }

export type ButtonProps = ButtonElementProps | LinkElementProps

export default function Button({
  children,
  size = 'short',
  variant = 'filled',
  color = 'red',
  arrow = true,
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    base,
    sizes[size],
    treatments[variant][color],
    variantMotion[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {arrow && (
        <FaArrowRight
          aria-hidden
          className="absolute left-5 top-1/2 h-[0.9em] w-[0.9em] -translate-x-2 -translate-y-1/2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
        />
      )}
      <span>{children}</span>
      {arrow && (
        <FaArrowRight
          aria-hidden
          className="absolute right-5 top-1/2 h-[0.9em] w-[0.9em] -translate-y-1/2 opacity-100 transition-all duration-300 ease-out group-hover:translate-x-2 group-hover:opacity-0"
        />
      )}
    </>
  )

  if (props.href !== undefined) {
    const { href, ...rest } = props as LinkElementProps
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  const { type = 'button', ...rest } = props as ButtonElementProps
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  )
}
