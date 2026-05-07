// lint-staged runs on every git commit for staged files only.
// ESLint and Prettier are scoped per workspace so each package's own
// eslint.config.mjs and .prettierrc are picked up. ESLint 9 flat config
// resolves config relative to its cwd, so we run it inside each workspace.

const WORKSPACES = [
  { dir: 'web', filter: 'web' },
  { dir: 'cms', filter: 'cms' },
]

const groupByWorkspace = (filePaths) => {
  const groups = new Map()
  for (const fp of filePaths) {
    const normalized = fp.replace(/\\/g, '/')
    const ws = WORKSPACES.find((w) => normalized.includes(`/${w.dir}/`))
    if (!ws) continue
    if (!groups.has(ws)) groups.set(ws, [])
    groups.get(ws).push(fp)
  }
  return groups
}

export default {
  '**/*.{ts,tsx,js,jsx,mjs,cjs}': (files) => {
    const groups = groupByWorkspace(files)
    return [...groups.entries()].flatMap(([ws, fs]) => [
      `pnpm --filter ${ws.filter} exec eslint --max-warnings=0 ${fs.join(' ')}`,
      `pnpm --filter ${ws.filter} exec prettier --write ${fs.join(' ')}`,
    ])
  },
  '**/*.{json,md,yaml,yml,css}': (files) => {
    const groups = groupByWorkspace(files)
    return [...groups.entries()].map(
      ([ws, fs]) => `pnpm --filter ${ws.filter} exec prettier --write ${fs.join(' ')}`,
    )
  },
}
