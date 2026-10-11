import * as migration_20260906_223448_baseline from './20260906_223448_baseline'
import * as migration_20260906_223523_event_rsvps from './20260906_223523_event_rsvps'

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
]
