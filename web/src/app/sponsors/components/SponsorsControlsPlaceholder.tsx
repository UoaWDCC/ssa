'use client'

import CategoryFilters from '@/components/CategoryFilters'
import SearchBar from '@/components/SearchBar'

import { SPONSOR_CATEGORIES } from './SponsorsGrid'

const FILTER_OPTIONS = ['ALL', ...SPONSOR_CATEGORIES] as const

const noop = () => {}

export default function SponsorsControlsPlaceholder() {
  return (
    <>
      <SearchBar
        value=""
        onChange={noop}
        placeholder="Search Sponsor"
        ariaLabel="Search sponsors"
      />

      <CategoryFilters
        options={FILTER_OPTIONS}
        selectedOption="ALL"
        onChange={noop}
        ariaLabel="Filter sponsors by category"
        iconlessOption="ALL"
        className="mt-4"
      />
    </>
  )
}
