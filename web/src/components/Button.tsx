import Link from 'next/link'
import type React from 'react'
import { FiArrowRight } from 'react-icons/fi'

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
  'group relative inline-flex items-center justify-center overflow-hidden rounded-full font-sans font-bold leading-tight cursor-pointer select-none transition-all duration-300 ease-out shadow-[0_3px_0_0_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_rgba(0,0,0,0.08)] active:translate-y-0 active:shadow-[0_2px_0_0_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-ssa-muted-gold focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none'

const sizes: Record<ButtonSize, string> = {
  short: 'py-2.5 text-base md:py-3 md:text-lg',
  long: 'w-full py-3.5 text-lg',
}

// Horizontal metrics, in `em` so they track the label size instead of needing a
// responsive override per breakpoint:
//   inset (2.2em)    — edge gap, and the slot both arrows sit in
//   reserve (1.8em)  — arrow width (1.2em) + gap to the label (0.6em)
// The arrow's side is padded by inset + reserve, so at rest the label starts flush
// against the empty slot the incoming arrow will land in, and the label + arrow read
// as one centred group. On hover the label slides across by exactly `reserve`,
// landing mirrored as the arrows swap sides.
const padX: Record<ArrowSide | 'none', string> = {
  right: 'pl-[2.2em] pr-[4em]',
  left: 'pl-[4em] pr-[2.2em]',
  none: 'px-[2.2em]',
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
  'pointer-events-none absolute top-1/2 h-[1.2em] w-[1.2em] -translate-y-1/2 transition-all duration-300 ease-out'

// Per starting-side motion: which slot the arrow occupies by default, where it
// animates on hover, and how the label slides. `leftSlot`/`rightSlot` are the two
// absolute arrow elements; `text` shifts the label toward the vacated side.
const arrowMotion: Record<
  ArrowSide,
  { leftSlot: string; rightSlot: string; text: string }
> = {
  // Arrow starts on the right; on hover it slides all the way off the right edge
  // while a fresh arrow slides in from off the left edge (overflow-hidden clips
  // both ends, so they travel rather than fade). Both slots rest at the 2.2em inset;
  // 4em of travel clears the inset plus the arrow's own width. The label shifts by
  // `reserve` (1.8em), so it ends up flush against the arrow's vacated side.
  right: {
    leftSlot: 'left-[2.2em] -translate-x-[4em] group-hover:translate-x-0',
    rightSlot: 'right-[2.2em] translate-x-0 group-hover:translate-x-[4em]',
    text: 'transition-transform duration-300 ease-out group-hover:translate-x-[1.8em]',
  },
  // Mirror: arrow starts on the left, slides off the left, new one enters from the right.
  left: {
    leftSlot: 'left-[2.2em] translate-x-0 group-hover:-translate-x-[4em]',
    rightSlot: 'right-[2.2em] translate-x-[4em] group-hover:translate-x-0',
    text: 'transition-transform duration-300 ease-out group-hover:-translate-x-[1.8em]',
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

// Derive link props from `next/link` so callers keep Next features
// (prefetch/replace/scroll and the UrlObject `href` form).
type LinkElementProps = CommonProps &
  Omit<React.ComponentProps<typeof Link>, keyof CommonProps>

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
  // A `long` button is full-width, so the arrow parks far from the label and the
  // mirror reading doesn't apply — keep the padding even so the label stays centred
  // in the bar, as with an arrowless button.
  const padding = size === 'long' || !arrow ? padX.none : padX[arrowSide]

  const classes = [
    base,
    sizes[size],
    padding,
    treatments[variant][color],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const motion = arrowMotion[arrowSide]
  const content = (
    <>
      {arrow && (
        <FiArrowRight
          aria-hidden
          className={`${arrowBase} ${motion.leftSlot}`}
        />
      )}
      <span className={arrow ? motion.text : undefined}>{children}</span>
      {arrow && (
        <FiArrowRight
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
