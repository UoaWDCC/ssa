import React from 'react'

type DashboardWelcomeProps = {
  user?: {
    email?: string | null
    firstName?: string | null
    name?: string | null
  } | null
}

const getFirstName = (user: DashboardWelcomeProps['user']) => {
  const displayName = user?.firstName || user?.name || user?.email?.split('@')[0]

  return displayName?.trim().split(/\s+/)[0] || 'there'
}

const DashboardWelcome = ({ user }: DashboardWelcomeProps) => (
  <section className="ssa-dashboard-welcome">
    <div className="ssa-dashboard-welcome__copy">
      <p className="ssa-dashboard-welcome__eyebrow">SSA / Content Studio</p>
      <h1>Welcome back, {getFirstName(user)}.</h1>
      <p className="ssa-dashboard-welcome__summary">
        Keep the community informed and the association running smoothly from one place.
      </p>
    </div>

    <div aria-hidden="true" className="ssa-dashboard-welcome__palette">
      <span className="ssa-dashboard-welcome__swatch ssa-dashboard-welcome__swatch--primary" />
      <span className="ssa-dashboard-welcome__swatch ssa-dashboard-welcome__swatch--blue" />
      <span className="ssa-dashboard-welcome__swatch ssa-dashboard-welcome__swatch--cyan" />
      <span className="ssa-dashboard-welcome__swatch ssa-dashboard-welcome__swatch--muted" />
    </div>
  </section>
)

export default DashboardWelcome
