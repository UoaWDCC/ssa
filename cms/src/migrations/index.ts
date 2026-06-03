import * as migration_20260526_190419 from './20260526_190419'

export const migrations = [
  {
    up: migration_20260526_190419.up,
    down: migration_20260526_190419.down,
    name: '20260526_190419',
  },
]
