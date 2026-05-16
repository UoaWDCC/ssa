import Link from 'next/link'
import type React from 'react'

type CtaLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

export default function CtaLink({
  href,
  children,
  className = '',
}: CtaLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full font-averia font-bold leading-tight transition-colors focus:outline-none focus:ring-2 focus:ring-ssa-muted-gold focus:ring-offset-2 ${className}`}
    >
      {children}
    </Link>
  )
}
