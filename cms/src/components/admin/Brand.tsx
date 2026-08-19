import React from 'react'

type BrandComponentProps = {
  payload?: {
    config?: {
      routes?: {
        admin?: string
      }
    }
  }
}

type BrandMarkProps = {
  className?: string
}

const BrandMark = ({ className }: BrandMarkProps) => (
  <svg
    aria-hidden="true"
    className={className}
    focusable="false"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill="#100C3E" height="48" rx="14" width="48" />
    <path d="M10 12h9v24h-9z" fill="#FFFFFF" />
    <path d="M19 12h10v24H19z" fill="#221DCA" />
    <path d="M29 12h9v24h-9z" fill="#00CAEF" />
  </svg>
)

const BrandWordmark = () => (
  <span className="ssa-brand__wordmark">
    <strong>SSA</strong>
    <span>Content Studio</span>
  </span>
)

export const BrandLogo = () => (
  <div aria-label="SSA Content Studio" className="ssa-brand ssa-brand--logo" role="img">
    <BrandMark className="ssa-brand__mark" />
    <BrandWordmark />
  </div>
)

export const BrandIcon = () => <BrandMark className="ssa-brand__icon" />

export const NavBrand = ({ payload }: BrandComponentProps) => (
  <a className="ssa-nav-brand" href={payload?.config?.routes?.admin || '/admin'}>
    <BrandMark className="ssa-nav-brand__mark" />
    <BrandWordmark />
  </a>
)

export const LoginIntro = () => (
  <div className="ssa-login-intro">
    <p className="ssa-login-intro__eyebrow">SSA administration</p>
    <h1>Welcome back</h1>
    <p>Sign in to manage members, events, media, sponsors, and the executive team.</p>
  </div>
)
