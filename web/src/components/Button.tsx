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

// Horizontal metrics are in `em` so they track the label size instead of needing a
// responsive override per breakpoint. `px-[2.2em]` is the edge inset — for `short` it
// sets the pill's width, for `long` it's just a floor. The arrow's own room is
// reserved inside the label group (see `arrowMotion.reserve`), not against the pill
// edges, so the label + arrow stay centred together at any pill width.
const sizes: Record<ButtonSize, string> = {
  short: 'px-[2.2em] py-2.5 text-base md:py-3 md:text-lg',
  long: 'w-full px-[2.2em] py-3.5 text-lg',
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

// The label and both arrow slots live in a wrapper that hugs them, so the whole group
// centres as one unit — a `long` button looks like a `short` one, just wider.
const arrowGroup = 'relative inline-flex items-center'

// One arrow slot: a fixed 1.2em window pinned to an edge of the group. The window
// clips its icon, so an arrow sliding out wipes away at the label's edge rather than
// having to travel to the pill's edge — a distance that varies with pill width and
// would leave the arrow popping in mid-bar on a full-width button.
const arrowSlot =
  'pointer-events-none absolute top-1/2 h-[1.2em] w-[1.2em] -translate-y-1/2 overflow-hidden'
const arrowIcon = 'h-full w-full transition-transform duration-300 ease-out'

// Per starting-side motion. `reserve` is the room the arrow needs inside the group —
// its 1.2em width plus a 0.6em gap to the label — so at rest the label sits flush
// against the empty slot the incoming arrow will land in. `leftIcon`/`rightIcon` slide
// each icon out of its own window by exactly its width (`translate-x-full`). `text`
// shifts the label across by `reserve`, landing it mirrored as the arrows swap sides.
const arrowMotion: Record<
  ArrowSide,
  { reserve: string; leftIcon: string; rightIcon: string; text: string }
> = {
  // Arrow starts on the right; on hover it wipes out to the right while a fresh arrow
  // wipes in on the left and the label slides right to fill the vacated space.
  right: {
    reserve: 'pr-[1.8em]',
    leftIcon: '-translate-x-full group-hover:translate-x-0',
    rightIcon: 'translate-x-0 group-hover:translate-x-full',
    text: 'transition-transform duration-300 ease-out group-hover:translate-x-[1.8em]',
  },
  // Mirror: arrow starts on the left, wipes out left, new one wipes in on the right.
  left: {
    reserve: 'pl-[1.8em]',
    leftIcon: 'translate-x-0 group-hover:-translate-x-full',
    rightIcon: 'translate-x-full group-hover:translate-x-0',
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
  const classes = [base, sizes[size], treatments[variant][color], className]
    .filter(Boolean)
    .join(' ')

  const motion = arrowMotion[arrowSide]
  const content = arrow ? (
    <span className={`${arrowGroup} ${motion.reserve}`}>
      <span className={`${arrowSlot} left-0`}>
        <FiArrowRight
          aria-hidden
          className={`${arrowIcon} ${motion.leftIcon}`}
        />
      </span>
      <span className={motion.text}>{children}</span>
      <span className={`${arrowSlot} right-0`}>
        <FiArrowRight
          aria-hidden
          className={`${arrowIcon} ${motion.rightIcon}`}
        />
      </span>
    </span>
  ) : (
    <span>{children}</span>
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
