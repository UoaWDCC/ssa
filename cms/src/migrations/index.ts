import * as migration_20260906_223448_baseline from './20260906_223448_baseline'
import * as migration_20260906_223523_event_rsvps from './20260906_223523_event_rsvps'
import * as migration_20260929_000001_sponsors_category from './20260929_000001_sponsors_category'
import * as migration_20261008_205511 from './20261008_205511'
import * as migration_20261011_000001_members_only_events from './20261011_000001_members_only_events'
import * as migration_20261012_000001_event_waitlist from './20261012_000001_event_waitlist'

export const migrations = [
  {
    up: migration_20260906_223448_baseline.up,
    down: migration_20260906_223448_baseline.down,
    name: '20260906_223448_baseline',
  },
  {
    up: migration_20260906_223523_event_rsvps.up,
    down: migration_20260906_223523_event_rsvps.down,
    name: '20260906_223523_event_rsvps',
  },
  {
    up: migration_20260929_000001_sponsors_category.up,
    down: migration_20260929_000001_sponsors_category.down,
    name: '20260929_000001_sponsors_category',
  },
  {
    up: migration_20261008_205511.up,
    down: migration_20261008_205511.down,
    name: '20261008_205511',
  },
  {
    up: migration_20261011_000001_members_only_events.up,
    down: migration_20261011_000001_members_only_events.down,
    name: '20261011_000001_members_only_events',
  },
  {
    up: migration_20261012_000001_event_waitlist.up,
    down: migration_20261012_000001_event_waitlist.down,
    name: '20261012_000001_event_waitlist',
  },
]
