import Link from 'next/link'
import type React from 'react'
import { FaArrowRight } from 'react-icons/fa6'

export type ButtonSize = 'short' | 'long'
export type ButtonVariant = 'filled' | 'light' | 'outline'
export type ButtonColor = 'red' | 'yellow' | 'skin'
export type ArrowSide = 'left' | 'right'

/**
 * Shared SSA pill button (matches the finalized "JOIN SSA!" Figma design).
 *
 * On hover the background and text colours swap, the label slides across, and the
 * arrow animates to the opposite side of the button while the pill lifts.
 *
 * - `size`      — `short` (content width) or `long` (full-width CTA).
 * - `variant`   — `filled` (accent fill, light text) · `light` (cream fill, accent text) · `outline`.
 * - `color`     — accent token driving the colour so it can be changed via a prop.
 * - `arrow`     — show the animated arrow (default `true`).
 * - `arrowSide` — which side the arrow starts on; it moves to the opposite side on hover
 *                 (default `right`: starts right → hover left; set `left` for the reverse).
 * - `href`      — when set, renders a Next `Link`; otherwise a native `<button>`.
 */

const base =
  'group relative inline-flex items-center justify-center overflow-hidden rounded-full font-averia font-bold leading-tight cursor-pointer select-none transition-all duration-300 ease-out shadow-[0_3px_0_0_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_rgba(0,0,0,0.08)] active:translate-y-0 active:shadow-[0_2px_0_0_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-ssa-muted-gold focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none'

const sizes: Record<ButtonSize, string> = {
  short: 'px-10 py-2.5 text-base md:px-11 md:py-3 md:text-lg',
  long: 'w-full px-12 py-3.5 text-lg',
}

// Colour treatments — background + text colours swap on hover. Full literal class
// strings so Tailwind can detect them.
const treatments: Record<ButtonVariant, Record<ButtonColor, string>> = {
  filled: {
    red: 'bg-ssa-red text-ssa-white hover:bg-ssa-yellow-light hover:text-ssa-red',
    yellow:
      'bg-ssa-dark-skin-yellow text-ssa-cta-text hover:bg-ssa-yellow-light hover:text-ssa-muted-gold',
    skin: 'bg-ssa-skin-yellow text-ssa-category-text hover:bg-ssa-dark-skin-yellow hover:text-ssa-cta-text',
  },
  light: {
    red: 'bg-ssa-yellow-light text-ssa-red hover:bg-ssa-red hover:text-ssa-white',
    yellow:
      'bg-ssa-yellow-light text-ssa-muted-gold hover:bg-ssa-dark-skin-yellow hover:text-ssa-cta-text',
    skin: 'bg-ssa-yellow-light text-ssa-category-text hover:bg-ssa-skin-yellow hover:text-ssa-cta-text',
  },
  outline: {
    red: 'bg-transparent border-[3px] border-ssa-red text-ssa-red hover:bg-ssa-red hover:text-ssa-white',
    yellow:
      'bg-transparent border-[3px] border-ssa-dark-skin-yellow text-ssa-muted-gold hover:bg-ssa-dark-skin-yellow hover:text-ssa-white',
    skin: 'bg-transparent border-[3px] border-ssa-dark-skin-yellow text-ssa-category-text hover:bg-ssa-skin-yellow hover:text-ssa-cta-text',
  },
}

const arrowBase =
  'pointer-events-none absolute top-1/2 h-[0.9em] w-[0.9em] -translate-y-1/2 transition-all duration-300 ease-out'

// Per starting-side motion: which slot the arrow occupies by default, where it
// animates on hover, and how the label slides. `leftSlot`/`rightSlot` are the two
// absolute arrow elements; `text` shifts the label toward the vacated side.
const arrowMotion: Record<
  ArrowSide,
  { leftSlot: string; rightSlot: string; text: string }
> = {
  // Arrow starts on the right; on hover it slides all the way off the right edge
  // while a fresh arrow slides in from off the left edge (overflow-hidden clips
  // both ends, so they travel rather than fade).
  right: {
    leftSlot: 'left-6 -translate-x-16 group-hover:translate-x-0',
    rightSlot: 'right-6 translate-x-0 group-hover:translate-x-16',
    text: 'transition-transform duration-300 ease-out group-hover:translate-x-2',
  },
  // Mirror: arrow starts on the left, slides off the left, new one enters from the right.
  left: {
    leftSlot: 'left-6 translate-x-0 group-hover:-translate-x-16',
    rightSlot: 'right-6 translate-x-16 group-hover:translate-x-0',
    text: 'transition-transform duration-300 ease-out group-hover:-translate-x-2',
  },
}

type CommonProps = {
  children: React.ReactNode
  size?: ButtonSize
  variant?: ButtonVariant
  color?: ButtonColor
  /** Show the animated arrow (default `true`). */
  arrow?: boolean
  /** Side the arrow starts on; moves to the opposite side on hover (default `right`). */
  arrowSide?: ArrowSide
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
  arrowSide = 'right',
  className = '',
  ...props
}: ButtonProps) {
  const classes = [base, sizes[size], treatments[variant][color], className]
    .filter(Boolean)
    .join(' ')

  const motion = arrowMotion[arrowSide]
  const content = (
    <>
      {arrow && (
        <FaArrowRight
          aria-hidden
          className={`${arrowBase} ${motion.leftSlot}`}
        />
      )}
      <span className={arrow ? motion.text : undefined}>{children}</span>
      {arrow && (
        <FaArrowRight
          aria-hidden
          className={`${arrowBase} ${motion.rightSlot}`}
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
