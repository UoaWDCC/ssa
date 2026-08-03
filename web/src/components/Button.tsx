import Link from 'next/link'
import type React from 'react'
import { FiArrowRight } from 'react-icons/fi'

export type ButtonSize = 'short' | 'long'
export type ButtonVariant = 'filled' | 'light' | 'outline'
export type ButtonColor = 'red' | 'pink' | 'yellow' | 'skin'
export type ArrowSide = 'left' | 'right'

const base =
  'group relative inline-flex cursor-pointer select-none items-center justify-center overflow-hidden rounded-full font-be-vietnam-pro font-bold leading-tight transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-ssa-muted-gold focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const sizes: Record<ButtonSize, string> = {
  short: 'px-[2.2em] py-2.5 text-base md:py-3 md:text-lg',
  long: 'w-full px-[2.2em] py-3.5 text-lg',
}

const treatments: Record<ButtonVariant, Record<ButtonColor, string>> = {
  filled: {
    red: 'bg-ssa-red text-ssa-white hover:bg-ssa-yellow-light hover:text-ssa-red',
    pink: 'bg-ssa-red-light text-ssa-white hover:bg-ssa-red hover:text-ssa-white',
    yellow:
      'bg-ssa-dark-skin-yellow text-ssa-cta-text hover:bg-ssa-yellow-light hover:text-ssa-muted-gold',
    skin: 'bg-ssa-skin-yellow text-ssa-category-text hover:bg-ssa-dark-skin-yellow hover:text-ssa-cta-text',
  },
  light: {
    red: 'bg-ssa-yellow-light text-ssa-red hover:bg-ssa-red hover:text-ssa-white',
    pink: 'bg-ssa-yellow-light text-ssa-red-light hover:bg-ssa-red-light hover:text-ssa-white',
    yellow:
      'bg-ssa-yellow-light text-ssa-muted-gold hover:bg-ssa-dark-skin-yellow hover:text-ssa-cta-text',
    skin: 'bg-ssa-yellow-light text-ssa-category-text hover:bg-ssa-skin-yellow hover:text-ssa-cta-text',
  },
  outline: {
    red: 'border-[3px] border-ssa-red bg-transparent text-ssa-red hover:bg-ssa-red hover:text-ssa-white',
    pink: 'border-[3px] border-ssa-red-light bg-transparent text-ssa-red-light hover:bg-ssa-red-light hover:text-ssa-white',
    yellow:
      'border-[3px] border-ssa-dark-skin-yellow bg-transparent text-ssa-muted-gold hover:bg-ssa-dark-skin-yellow hover:text-ssa-white',
    skin: 'border-[3px] border-ssa-dark-skin-yellow bg-transparent text-ssa-category-text hover:bg-ssa-skin-yellow hover:text-ssa-cta-text',
  },
}

const arrowGroup = 'relative inline-flex items-center'

const arrowSlot =
  'pointer-events-none absolute top-1/2 h-[1.2em] w-[1.2em] -translate-y-1/2 overflow-hidden'

const arrowIcon = 'h-full w-full transition-transform duration-300 ease-out'

const arrowMotion: Record<
  ArrowSide,
  {
    reserve: string
    leftIcon: string
    rightIcon: string
    text: string
  }
> = {
  right: {
    reserve: 'pr-[1.8em]',
    leftIcon: '-translate-x-full group-hover:translate-x-0',
    rightIcon: 'translate-x-0 group-hover:translate-x-full',
    text: 'transition-transform duration-300 ease-out group-hover:translate-x-[1.8em]',
  },
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
  arrow?: boolean
  arrowSide?: ArrowSide
  className?: string
}

type ButtonElementProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined
  }

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
    const { href, target, rel, ...rest } = props as LinkElementProps

    return (
      <Link
        href={href}
        target={target}
        rel={target === '_blank' ? (rel ?? 'noopener noreferrer') : rel}
        className={classes}
        {...rest}
      >
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
